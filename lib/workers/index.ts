const Redis = require('ioredis');
const { EventEmitter } = require('events');

/**
 * Functional Job Worker Implementation
 * 
 * This approach uses factory functions and closures instead of classes
 * Benefits: More modular, easier to test individual functions, functional programming style
 */

/**
 * Create a job worker instance using factory pattern
 * @param {object} config - Worker configuration
 * @returns {object} Worker instance with methods
 */
function createJobWorker(config = {}) {
  // Default configuration
  const defaultConfig = {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true
    },
    queue: {
      name: config.queueName || 'default_queue',
      concurrency: config.concurrency || 3,
      pollInterval: config.pollInterval || 1000,
      jobTimeout: config.jobTimeout || 30000,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      shutdownTimeout: config.shutdownTimeout || 30000
    }
  };

  // Merge user config with defaults
  const workerConfig = {
    ...defaultConfig,
    ...config,
    queue: { ...defaultConfig.queue, ...config.queue }
  };

  // Worker state (closure variables)
  let redis = null;
  let redisSubscriber = null;
  let isRunning = false;
  let isShuttingDown = false;
  let activeJobs = new Map();
  let jobHandlers = new Map();
  let workerPromises = [];
  let eventEmitter = new EventEmitter();

  // Statistics
  let stats = {
    processed: 0,
    failed: 0,
    retried: 0,
    startTime: null
  };

  // Queue names
  const queues = {
    main: `${workerConfig.queue.name}:waiting`,
    processing: `${workerConfig.queue.name}:processing`,
    failed: `${workerConfig.queue.name}:failed`,
    completed: `${workerConfig.queue.name}:completed`,
    deadLetter: `${workerConfig.queue.name}:dead_letter`
  };

  /**
   * Classify error type for better retry strategies
   * @param {Error} error - The error object
   * @returns {string} Error classification
   */
  function classifyError(error) {
    const message = error.message.toLowerCase();
    const code = error.code;

    // Network-related errors
    if (code === 'ECONNRESET' || code === 'ECONNREFUSED' || code === 'ETIMEDOUT' || 
        code === 'ENOTFOUND' || message.includes('network') || message.includes('connection')) {
      return 'network';
    }

    // Rate limiting errors
    if (code === 'RATE_LIMITED' || message.includes('rate limit') || 
        message.includes('too many requests') || error.status === 429) {
      return 'rate_limit';
    }

    // Timeout errors
    if (message.includes('timeout') || message.includes('timed out') || code === 'TIMEOUT') {
      return 'timeout';
    }

    // Service unavailable errors
    if (error.status === 503 || message.includes('service unavailable') || 
        message.includes('server error') || code === 'SERVICE_UNAVAILABLE') {
      return 'service_unavailable';
    }

    // Authentication/Authorization errors (usually non-retryable)
    if (error.status === 401 || error.status === 403 || 
        message.includes('unauthorized') || message.includes('forbidden')) {
      return 'auth_error';
    }

    // Validation errors (non-retryable)
    if (error.status === 400 || message.includes('validation') || 
        message.includes('invalid') || code === 'VALIDATION_ERROR') {
      return 'validation_error';
    }

    // Resource not found (usually non-retryable)
    if (error.status === 404 || message.includes('not found')) {
      return 'not_found';
    }

    return 'unknown';
  }

  /**
   * Determine if an error should be retried based on its type
   * @param {Error} error - The error object
   * @param {string} errorType - Classified error type
   * @returns {boolean} Whether the error should be retried
   */
  function shouldRetryError(error, errorType) {
    // Non-retryable error types
    const nonRetryableErrors = [
      'validation_error',
      'auth_error',
      'not_found'
    ];

    if (nonRetryableErrors.includes(errorType)) {
      return false;
    }

    // Check for specific error patterns that shouldn't be retried
    const message = error.message.toLowerCase();
    const nonRetryablePatterns = [
      'invalid json',
      'malformed request',
      'missing required field',
      'permission denied',
      'access denied'
    ];

    return !nonRetryablePatterns.some(pattern => message.includes(pattern));
  }

  /**
   * Move job to dead letter queue with reason
   * @param {object} job - Failed job
   * @param {string} reason - Reason for dead letter placement
   */
  async function moveToDeadLetterQueue(job, reason) {
    const deadLetterJob = {
      ...job,
      deadLetterReason: reason,
      deadLetterTimestamp: new Date().toISOString(),
      originalQueueName: workerConfig.queue.name
    };

    await redis.lpush(queues.deadLetter, JSON.stringify(deadLetterJob));
    
    logMessage('error', `Job moved to dead letter queue`, {
      jobId: job.id,
      reason,
      attempts: job.attempts
    });
  }

  /**
   * Enhanced execute function with timeout and graceful degradation
   * @param {Promise} promise - Promise to execute
   * @param {number} timeout - Timeout in milliseconds
   * @param {object} fallbackOptions - Options for graceful degradation
   */
  async function executeWithTimeout(promise, timeout, fallbackOptions = {}) {
    const timeoutController = new AbortController();
    
    const timeoutPromise = new Promise((_, reject) => {
      const timeoutId = setTimeout(() => {
        timeoutController.abort();
        reject(new Error(`Operation timed out after ${timeout}ms`));
      }, timeout);
      
      // Clear timeout if main promise resolves first
      promise.finally(() => clearTimeout(timeoutId));
    });

    try {
      // Race between main promise and timeout
      const result = await Promise.race([promise, timeoutPromise]);
      return result;
    } catch (error) {
      // Handle graceful degradation
      if (fallbackOptions.fallbackFunction && typeof fallbackOptions.fallbackFunction === 'function') {
        try {
          logMessage('warn', `Using fallback function due to error`, {
            error: error.message,
            fallbackEnabled: true
          });
          
          return await fallbackOptions.fallbackFunction(error);
        } catch (fallbackError) {
          logMessage('error', `Fallback function also failed`, {
            originalError: error.message,
            fallbackError: fallbackError.message
          });
          throw fallbackError;
        }
      }
      
      throw error;
    }
  }

  /**
   * Circuit breaker implementation for external service calls
   */
  function createCircuitBreaker(options = {}) {
    const config = {
      failureThreshold: options.failureThreshold || 5,
      resetTimeout: options.resetTimeout || 30000,
      monitoringPeriod: options.monitoringPeriod || 60000,
      ...options
    };

    let state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    let failures = 0;
    let lastFailureTime = null;
    let successes = 0;

    return {
      async execute(fn, fallbackFn = null) {
        if (state === 'OPEN') {
          if (Date.now() - lastFailureTime > config.resetTimeout) {
            state = 'HALF_OPEN';
            successes = 0;
          } else {
            if (fallbackFn) {
              return await fallbackFn();
            }
            throw new Error('Circuit breaker is OPEN');
          }
        }

        try {
          const result = await fn();
          
          if (state === 'HALF_OPEN') {
            successes++;
            if (successes >= 3) { // Require 3 successes to close
              state = 'CLOSED';
              failures = 0;
            }
          } else {
            failures = 0; // Reset failures on success
          }
          
          return result;
        } catch (error) {
          failures++;
          lastFailureTime = Date.now();
          
          if (failures >= config.failureThreshold) {
            state = 'OPEN';
            logMessage('warn', `Circuit breaker opened`, {
              failures,
              threshold: config.failureThreshold
            });
          }
          
          if (fallbackFn && state === 'OPEN') {
            return await fallbackFn();
          }
          
          throw error;
        }
      },
      
      getState: () => ({ state, failures, successes }),
      reset: () => {
        state = 'CLOSED';
        failures = 0;
        successes = 0;
        lastFailureTime = null;
      }
    };
  }

  /**
   * Initialize Redis connections
   */
  async function initializeRedis() {
    try {
      redis = new Redis(workerConfig.redis);
      redisSubscriber = new Redis(workerConfig.redis);

      // Setup Redis event handlers
      setupRedisEventHandlers(redis, 'main');
      setupRedisEventHandlers(redisSubscriber, 'subscriber');

      await Promise.all([
        redis.ping(),
        redisSubscriber.ping()
      ]);

      logMessage('info', 'Redis connections initialized');
    } catch (error) {
      logMessage('error', 'Failed to initialize Redis', { error: error.message });
      throw error;
    }
  }

  /**
   * Setup Redis connection event handlers
   */
  function setupRedisEventHandlers(redisClient, clientType) {
    redisClient.on('connect', () => {
      logMessage('info', `Redis ${clientType} connection established`);
    });

    redisClient.on('error', (err) => {
      logMessage('error', `Redis ${clientType} error`, { error: err.message });
    });

    redisClient.on('ready', () => {
      logMessage('info', `Redis ${clientType} ready`);
    });
  }

  /**
   * Register a job handler
   * @param {string} jobType - Type of job
   * @param {function} handler - Handler function
   */
  function registerHandler(jobType, handler) {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }

    jobHandlers.set(jobType, handler);
    logMessage('info', `Registered handler for job type: ${jobType}`);
  }

  /**
   * Add job to queue
   * @param {string} type - Job type
   * @param {object} data - Job data
   * @param {object} options - Job options
   */
  async function addJob(type, data, options = {}) {
    const job = {
      id: options.id || `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      priority: options.priority || 0,
      delay: options.delay || 0,
      maxRetries: options.maxRetries || workerConfig.queue.maxRetries,
      createdAt: new Date().toISOString(),
      attempts: 0
    };

    if (job.delay > 0) {
      // Schedule job for later
      const executeAt = Date.now() + job.delay;
      await redis.zadd(`${queues.main}:delayed`, executeAt, JSON.stringify(job));
    } else {
      // Add job immediately
      await redis.lpush(queues.main, JSON.stringify(job));
    }

    logMessage('info', `Job added to queue`, { jobId: job.id, type, delay: job.delay });
    return job.id;
  }

  /**
   * Process delayed jobs and retry jobs (move them to main queue when ready)
   */
  async function processDelayedJobs() {
    const now = Date.now();
    
    // Process delayed jobs
    const delayedJobs = await redis.zrangebyscore(
      `${queues.main}:delayed`,
      0,
      now,
      'LIMIT',
      0,
      100
    );

    // Process retry jobs
    const retryJobs = await redis.zrangebyscore(
      `${queues.main}:retry`,
      0,
      now,
      'LIMIT',
      0,
      100
    );

    const allReadyJobs = [...delayedJobs, ...retryJobs];

    if (allReadyJobs.length > 0) {
      const pipeline = redis.pipeline();
      
      delayedJobs.forEach(jobData => {
        pipeline.lpush(queues.main, jobData);
        pipeline.zrem(`${queues.main}:delayed`, jobData);
      });

      retryJobs.forEach(jobData => {
        pipeline.lpush(queues.main, jobData);
        pipeline.zrem(`${queues.main}:retry`, jobData);
      });

      await pipeline.exec();
      
      logMessage('info', `Moved ready jobs to main queue`, {
        delayed: delayedJobs.length,
        retry: retryJobs.length
      });
    }
  }

  /**
   * Main worker function that processes jobs
   * @param {number} workerId - Worker identifier
   */
  async function workerProcess(workerId) {
    logMessage('info', `Worker ${workerId} started`);

    while (isRunning && !isShuttingDown) {
      try {
        // Check for delayed jobs first
        await processDelayedJobs();

        // Get next job from queue (blocking operation)
        const result = await redisSubscriber.brpoplpush(
          queues.main,
          queues.processing,
          Math.floor(workerConfig.queue.pollInterval / 1000)
        );

        if (result) {
          await handleJob(result, workerId);
        }

      } catch (error) {
        if (error.message.includes('Connection is closed')) {
          logMessage('warn', `Worker ${workerId} connection closed, retrying...`);
          await sleep(1000);
          continue;
        }

        logMessage('error', `Worker ${workerId} error`, { error: error.message });
        await sleep(1000);
      }
    }

    logMessage('info', `Worker ${workerId} stopped`);
  }

  /**
   * Handle individual job processing
   * @param {string} jobData - Serialized job data
   * @param {number} workerId - Worker ID
   */
  async function handleJob(jobData, workerId) {
    let job = null;
    const startTime = Date.now();

    try {
      // Parse and validate job
      job = JSON.parse(jobData);
      
      if (!isValidJob(job)) {
        throw new Error('Invalid job structure');
      }

      // Get handler
      const handler = jobHandlers.get(job.type);
      if (!handler) {
        throw new Error(`No handler for job type: ${job.type}`);
      }

      logMessage('info', `Processing job`, {
        jobId: job.id,
        type: job.type,
        workerId,
        attempt: job.attempts + 1
      });

      // Track active job
      activeJobs.set(job.id, {
        job,
        workerId,
        startTime
      });

      // Execute job with timeout and graceful degradation
      const result = await executeWithTimeout(
        handler(job.data, job),
        workerConfig.queue.jobTimeout,
        {
          fallbackFunction: job.fallbackHandler ? 
            () => job.fallbackHandler(job.data, job) : 
            null
        }
      );

      // Job succeeded
      await handleJobSuccess(job, result, startTime);
      stats.processed++;

      eventEmitter.emit('job:completed', { job, result });

    } catch (error) {
      // Job failed
      await handleJobFailure(job, error, workerId);
      stats.failed++;

      eventEmitter.emit('job:failed', { job, error });

    } finally {
      // Cleanup
      if (job?.id) {
        activeJobs.delete(job.id);
        await redis.lrem(queues.processing, 1, jobData);
      }
    }
  }

  /**
   * Validate job structure
   * @param {object} job - Job object
   * @returns {boolean} Is valid
   */
  function isValidJob(job) {
    return job && 
           typeof job.id === 'string' && 
           typeof job.type === 'string' && 
           job.data !== undefined;
  }

  /**
   * Execute function with timeout
   * @param {Promise} promise - Promise to execute
   * @param {number} timeout - Timeout in milliseconds
   */
  function executeWithTimeout(promise, timeout) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Job timed out after ${timeout}ms`));
      }, timeout);

      promise
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timeoutId));
    });
  }

  /**
   * Handle successful job completion
   * @param {object} job - Job object
   * @param {*} result - Job result
   * @param {number} startTime - Job start time
   */
  async function handleJobSuccess(job, result, startTime) {
    const completedJob = {
      ...job,
      result,
      completedAt: new Date().toISOString(),
      processingTime: Date.now() - startTime
    };

    // Store completed job with TTL
    await redis.setex(
      `${queues.completed}:${job.id}`,
      86400, // 24 hours
      JSON.stringify(completedJob)
    );

    logMessage('info', `Job completed`, {
      jobId: job.id,
      processingTime: completedJob.processingTime
    });
  }

  /**
   * Handle job failure and retry logic with enhanced error classification
   * @param {object} job - Job object
   * @param {Error} error - Error that occurred
   * @param {number} workerId - Worker ID
   */
  async function handleJobFailure(job, error, workerId) {
    const attempts = (job.attempts || 0) + 1;
    const maxRetries = job.maxRetries || workerConfig.queue.maxRetries;

    // Classify error type for better handling
    const errorType = classifyError(error);
    const isRetryable = shouldRetryError(error, errorType);

    const failedJob = {
      ...job,
      attempts,
      lastError: {
        message: error.message,
        type: errorType,
        code: error.code,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        workerId,
        isRetryable
      },
      errors: [...(job.errors || []), {
        message: error.message,
        type: errorType,
        code: error.code,
        timestamp: new Date().toISOString(),
        workerId
      }]
    };

    logMessage('error', `Job failed`, {
      jobId: job.id,
      error: error.message,
      errorType,
      attempt: attempts,
      maxRetries,
      isRetryable
    });

    // Handle non-retryable errors immediately
    if (!isRetryable) {
      await moveToDeadLetterQueue(failedJob, 'non_retryable_error');
      eventEmitter.emit('job:dead_letter', { job: failedJob, reason: 'non_retryable_error' });
      return;
    }

    if (attempts <= maxRetries) {
      // Retry with exponential backoff and jitter
      const delay = calculateRetryDelay(attempts, errorType);
      
      // Use Redis for reliable delayed retry instead of setTimeout
      const retryAt = Date.now() + delay;
      await redis.zadd(`${queues.main}:retry`, retryAt, JSON.stringify(failedJob));
      
      stats.retried++;
      logMessage('info', `Job scheduled for retry`, {
        jobId: job.id,
        delay,
        attempt: attempts,
        retryAt: new Date(retryAt).toISOString()
      });

      eventEmitter.emit('job:retry', { job: failedJob, delay, attempt: attempts });
    } else {
      // Move to dead letter queue after max retries
      await moveToDeadLetterQueue(failedJob, 'max_retries_exceeded');
      eventEmitter.emit('job:dead_letter', { job: failedJob, reason: 'max_retries_exceeded' });
    }
  }

  /**
   * Calculate retry delay with exponential backoff and error-specific strategies
   * @param {number} attempt - Attempt number
   * @param {string} errorType - Type of error for adaptive delays
   * @returns {number} Delay in milliseconds
   */
  function calculateRetryDelay(attempt, errorType = 'unknown') {
    const baseDelay = workerConfig.queue.retryDelay;
    let multiplier = 1;

    // Adjust multiplier based on error type
    switch (errorType) {
      case 'rate_limit':
        multiplier = 3; // Longer delays for rate limiting
        break;
      case 'network':
        multiplier = 2; // Moderate delays for network issues
        break;
      case 'timeout':
        multiplier = 1.5; // Slightly longer for timeouts
        break;
      case 'service_unavailable':
        multiplier = 2.5; // Longer delays for service issues
        break;
      default:
        multiplier = 1;
    }

    const exponentialDelay = Math.pow(2, attempt - 1) * baseDelay * multiplier;
    const jitter = Math.random() * 1000; // Add jitter to prevent thundering herd
    const maxDelay = errorType === 'rate_limit' ? 300000 : 60000; // 5 min for rate limit, 1 min for others
    
    return Math.min(exponentialDelay + jitter, maxDelay);
  }

  /**
   * Start the worker
   */
  async function start() {
    if (isRunning) {
      logMessage('warn', 'Worker already running');
      return;
    }

    logMessage('info', 'Starting worker', {
      concurrency: workerConfig.queue.concurrency,
      queueName: workerConfig.queue.name
    });

    await initializeRedis();
    setupGracefulShutdown();

    isRunning = true;
    stats.startTime = Date.now();

    // Start worker processes
    workerPromises = [];
    for (let i = 0; i < workerConfig.queue.concurrency; i++) {
      workerPromises.push(workerProcess(i));
    }

    await Promise.all(workerPromises);
  }

  /**
   * Stop the worker gracefully
   */
  async function stop() {
    if (!isRunning || isShuttingDown) {
      return;
    }

    logMessage('info', 'Stopping worker gracefully');
    isShuttingDown = true;
    isRunning = false;

    // Wait for active jobs with timeout
    const shutdownStart = Date.now();
    while (activeJobs.size > 0 && 
           (Date.now() - shutdownStart) < workerConfig.queue.shutdownTimeout) {
      logMessage('info', `Waiting for ${activeJobs.size} active jobs`);
      await sleep(1000);
    }

    // Close Redis connections
    if (redis) await redis.quit();
    if (redisSubscriber) await redisSubscriber.quit();

    logMessage('info', 'Worker stopped', { stats: getStats() });
  }

  /**
   * Setup graceful shutdown handlers
   */
  function setupGracefulShutdown() {
    const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
    
    signals.forEach(signal => {
      process.on(signal, async () => {
        logMessage('info', `Received ${signal}, shutting down`);
        await stop();
        process.exit(0);
      });
    });
  }

  /**
   * Get worker statistics
   * @returns {object} Statistics
   */
  function getStats() {
    return {
      ...stats,
      activeJobs: activeJobs.size,
      uptime: stats.startTime ? Date.now() - stats.startTime : 0,
      isRunning,
      isShuttingDown,
      registeredHandlers: jobHandlers.size
    };
  }

  /**
   * Get queue information
   * @returns {object} Queue info
   */
  async function getQueueInfo() {
    const [waiting, processing, failed, delayed] = await Promise.all([
      redis.llen(queues.main),
      redis.llen(queues.processing),
      redis.llen(queues.failed),
      redis.zcard(`${queues.main}:delayed`)
    ]);

    return {
      waiting,
      processing,
      failed,
      delayed
    };
  }

  /**
   * Utility functions
   */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function logMessage(level, message, meta = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      worker: workerConfig.queue.name,
      ...meta
    };
    console.log(JSON.stringify(logEntry));
  }

  // Return public API
  return {
    // Core methods
    start,
    stop,
    registerHandler,
    addJob,

    // Information methods
    getStats,
    getQueueInfo,
    
    // Event handling
    on: eventEmitter.on.bind(eventEmitter),
    off: eventEmitter.off.bind(eventEmitter),
    emit: eventEmitter.emit.bind(eventEmitter),

    // Utility
    isRunning: () => isRunning,
    isShuttingDown: () => isShuttingDown
  };
}

// Example usage
async function exampleUsage() {
  // Create worker instance
  const worker = createJobWorker({
    queueName: 'example_queue',
    concurrency: 3,
    maxRetries: 2
  });

  // Register handlers
  worker.registerHandler('email', async (data) => {
    console.log(`Sending email to ${data.email}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { sent: true, messageId: `msg_${Date.now()}` };
  });

  worker.registerHandler('image', async (data) => {
    console.log(`Processing image: ${data.url}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { processed: true, newUrl: `processed_${data.url}` };
  });

  // Event listeners
  worker.on('job:completed', ({ job, result }) => {
    console.log(`✅ Job ${job.id} completed:`, result);
  });

  worker.on('job:failed', ({ job, error }) => {
    console.log(`❌ Job ${job.id} failed:`, error.message);
  });

  // Add some jobs
  await worker.addJob('email', { email: 'user@example.com', subject: 'Hello' });
  await worker.addJob('image', { url: 'image.jpg' });
  await worker.addJob('email', { email: 'admin@example.com' }, { delay: 5000 });

  // Start worker
  await worker.start();
}

// Export factory function
module.exports = createJobWorker;

// Run example if executed directly
if (require.main === module) {
  exampleUsage().catch(console.error);
}