//@ts-nocheck


// BullMQ Queue System with Dead Letter Queue, Exponential Backoff, and Error Handling
// This implementation uses BullMQ for production-ready queue management with Redis backing

import { Queue, Worker as BullMQWorker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import EventEmitter from 'events';

/**
 * Default configuration for BullMQ queues
 */
const DEFAULT_CONFIG = {
  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: process.env.REDIS_DB || 0,
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    lazyConnect: true
  },
  
  // Queue configuration
  queue: {
    defaultJobOptions: {
      removeOnComplete: 100,  // Keep last 100 completed jobs
      removeOnFail: 50,       // Keep last 50 failed jobs
      attempts: 3,            // Maximum retry attempts
      backoff: {
        type: 'exponential',
        delay: 1000,          // Base delay in milliseconds
        multiplier: 2,        // Exponential multiplier
        maxDelay: 30000       // Maximum delay cap
      },
      delay: 0,               // Initial delay
      priority: 0             // Job priority (higher = more priority)
    }
  },
  
  // Worker configuration
  worker: {
    concurrency: 3,           // Number of concurrent jobs
    maxStalledCount: 1,       // Max times a job can be stalled
    stalledInterval: 30000,   // Check for stalled jobs every 30s
    removeOnComplete: 100,
    removeOnFail: 50
  },
  
  // Dead Letter Queue configuration
  dlq: {
    enabled: true,
    maxRetries: 3,
    retentionDays: 7
  },
  
  // Health check configuration
  healthCheck: {
    enabled: true,
    interval: 10000,          // Health check every 10 seconds
    thresholds: {
      waiting: 1000,          // Alert if waiting jobs > 1000
      active: 50,             // Alert if active jobs > 50
      failed: 100             // Alert if failed jobs > 100
    }
  }
};

/**
 * Enhanced job processor with error handling and logging
 */
class JobProcessor {
  constructor(name, processFn, options = {}) {
    this.name = name;
    this.processFn = processFn;
    this.options = options;
    this.stats = {
      processed: 0,
      failed: 0,
      errors: new Map()
    };
  }

  /**
   * Process a job with comprehensive error handling
   */
  async process(job) {
    const startTime = Date.now();
    
    try {
      console.log(`Processing job ${job.id} of type ${this.name}`, {
        data: job.data,
        attempts: job.attemptsMade + 1,
        maxAttempts: job.opts.attempts
      });

      // Execute the actual job processing
      const result = await this.processFn(job);
      
      const duration = Date.now() - startTime;
      this.stats.processed++;
      
      console.log(`Job ${job.id} completed successfully in ${duration}ms`);
      
      return result;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.stats.failed++;
      
      // Track error types
      const errorType = error.constructor.name;
      this.stats.errors.set(errorType, (this.stats.errors.get(errorType) || 0) + 1);
      
      console.error(`Job ${job.id} failed after ${duration}ms:`, {
        error: error.message,
        stack: error.stack,
        attempts: job.attemptsMade + 1,
        maxAttempts: job.opts.attempts,
        data: job.data
      });
      
      // Re-throw to let BullMQ handle retries
      throw error;
    }
  }

  /**
   * Get processor statistics
   */
  getStats() {
    return {
      ...this.stats,
      errors: Object.fromEntries(this.stats.errors)
    };
  }
}

/**
 * Dead Letter Queue implementation using BullMQ
 */
class DeadLetterQueue extends EventEmitter {
  constructor(name, config = {}) {
    super();
    this.name = `${name}-dlq`;
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Create Redis connection
    this.redis = new IORedis(this.config.redis);
    
    // Create DLQ queue
    this.queue = new Queue(this.name, {
      connection: this.redis,
      defaultJobOptions: {
        removeOnComplete: false,  // Keep all DLQ jobs
        removeOnFail: false,      // Keep all failed DLQ jobs
        attempts: 1               // Don't retry DLQ jobs
      }
    });
    
    // Setup queue events
    this.events = new QueueEvents(this.name, { connection: this.redis });
    this.setupEventHandlers();
  }

  /**
   * Setup event handlers for DLQ
   */
  setupEventHandlers() {
    this.events.on('completed', (job) => {
      this.emit('job-requeued', job);
    });

    this.events.on('failed', (job, err) => {
      console.error(`DLQ job ${job.jobId} failed:`, err);
    });
  }

  /**
   * Add a job to the dead letter queue
   */
  async addJob(originalJob, finalError) {
    const dlqData = {
      originalJobId: originalJob.id,
      originalQueue: originalJob.queueName,
      originalData: originalJob.data,
      finalError: {
        message: finalError.message,
        stack: finalError.stack,
        name: finalError.name
      },
      attempts: originalJob.attemptsMade,
      failedAt: new Date().toISOString(),
      metadata: {
        createdAt: originalJob.timestamp,
        processedAt: originalJob.processedOn,
        finishedAt: originalJob.finishedOn
      }
    };

    const dlqJob = await this.queue.add('dead-letter-job', dlqData, {
      priority: originalJob.opts.priority || 0
    });

    this.emit('job-added', dlqJob, originalJob);
    console.log(`Job ${originalJob.id} moved to dead letter queue: ${dlqJob.id}`);
    
    return dlqJob;
  }

  /**
   * Requeue a job from DLQ back to original queue
   */
  async requeueJob(dlqJobId, targetQueue) {
    const dlqJob = await this.queue.getJob(dlqJobId);
    
    if (!dlqJob) {
      throw new Error(`DLQ job ${dlqJobId} not found`);
    }

    const originalData = dlqJob.data.originalData;
    const newJob = await targetQueue.add('requeued-job', originalData, {
      priority: dlqJob.opts.priority || 0
    });

    // Remove from DLQ
    await dlqJob.remove();
    
    this.emit('job-requeued', newJob, dlqJob);
    console.log(`Job ${dlqJobId} requeued as ${newJob.id}`);
    
    return newJob;
  }

  /**
   * Get DLQ statistics
   */
  async getStats() {
    const waiting = await this.queue.getWaiting();
    const completed = await this.queue.getCompleted();
    const failed = await this.queue.getFailed();

    return {
      waiting: waiting.length,
      completed: completed.length,
      failed: failed.length,
      total: waiting.length + completed.length + failed.length
    };
  }

  /**
   * Get all DLQ jobs
   */
  async getAllJobs() {
    const [waiting, completed, failed] = await Promise.all([
      this.queue.getWaiting(),
      this.queue.getCompleted(),
      this.queue.getFailed()
    ]);

    return {
      waiting,
      completed,
      failed,
      all: [...waiting, ...completed, ...failed]
    };
  }

  /**
   * Clean up old DLQ jobs
   */
  async cleanup(olderThanDays = 7) {
    const cutoff = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);
    
    await this.queue.clean(cutoff, 1000, 'completed');
    await this.queue.clean(cutoff, 1000, 'failed');
    
    console.log(`DLQ cleanup completed for jobs older than ${olderThanDays} days`);
  }

  /**
   * Close DLQ connections
   */
  async close() {
    await this.queue.close();
    await this.events.close();
    this.redis.disconnect();
  }
}

/**
 * Enhanced Queue Manager with BullMQ
 */
class QueueManager extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.queues = new Map();
    this.workers = new Map();
    this.processors = new Map();
    this.dlqs = new Map();
    this.queueEvents = new Map();
    this.healthCheckInterval = null;
    
    // Create Redis connection
    this.redis = new IORedis(this.config.redis);
    
    // Setup health monitoring
    if (this.config.healthCheck.enabled) {
      this.startHealthCheck();
    }
  }

  /**
   * Create a new queue with worker and DLQ
   */
  async createQueue(name, processor, options = {}) {
    if (this.queues.has(name)) {
      throw new Error(`Queue ${name} already exists`);
    }

    const queueConfig = { ...this.config.queue, ...options.queue };
    const workerConfig = { ...this.config.worker, ...options.worker };

    // Create main queue
    const queue = new Queue(name, {
      connection: this.redis,
      defaultJobOptions: queueConfig.defaultJobOptions
    });

    // Create job processor
    const jobProcessor = new JobProcessor(name, processor, options);
    
    // Create worker
    const worker = new BullMQWorker(name, 
      async (job) => await jobProcessor.process(job),
      {
        connection: this.redis,
        concurrency: workerConfig.concurrency,
        maxStalledCount: workerConfig.maxStalledCount,
        stalledInterval: workerConfig.stalledInterval,
        removeOnComplete: workerConfig.removeOnComplete,
        removeOnFail: workerConfig.removeOnFail
      }
    );

    // Create dead letter queue
    const dlq = new DeadLetterQueue(name, this.config);

    // Create queue events
    const queueEvents = new QueueEvents(name, { connection: this.redis });

    // Setup event handlers
    this.setupQueueEventHandlers(name, queue, worker, dlq, queueEvents);

    // Store references
    this.queues.set(name, queue);
    this.workers.set(name, worker);
    this.processors.set(name, jobProcessor);
    this.dlqs.set(name, dlq);
    this.queueEvents.set(name, queueEvents);

    console.log(`Queue ${name} created with ${workerConfig.concurrency} workers`);
    
    return {
      queue,
      worker,
      dlq,
      processor: jobProcessor
    };
  }

  /**
   * Setup event handlers for queue, worker, and DLQ
   */
  setupQueueEventHandlers(name, queue, worker, dlq, queueEvents) {
    // Worker events
    worker.on('completed', (job, result) => {
      this.emit('job-completed', { queueName: name, job, result });
    });

    worker.on('failed', async (job, err) => {
      this.emit('job-failed', { queueName: name, job, error: err });
      
      // Check if job should go to DLQ
      if (job.attemptsMade >= job.opts.attempts) {
        await dlq.addJob(job, err);
        this.emit('job-moved-to-dlq', { queueName: name, job, error: err });
      }
    });

    worker.on('stalled', (jobId) => {
      console.warn(`Job ${jobId} stalled in queue ${name}`);
      this.emit('job-stalled', { queueName: name, jobId });
    });

    // Queue events
    queueEvents.on('waiting', (job) => {
      this.emit('job-waiting', { queueName: name, job });
    });

    queueEvents.on('active', (job) => {
      this.emit('job-active', { queueName: name, job });
    });

    queueEvents.on('progress', (job, progress) => {
      this.emit('job-progress', { queueName: name, job, progress });
    });

    // DLQ events
    dlq.on('job-added', (dlqJob, originalJob) => {
      this.emit('dlq-job-added', { queueName: name, dlqJob, originalJob });
    });

    dlq.on('job-requeued', (newJob, dlqJob) => {
      this.emit('dlq-job-requeued', { queueName: name, newJob, dlqJob });
    });
  }

  /**
   * Add a job to a specific queue
   */
  async addJob(queueName, jobType, data, options = {}) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const job = await queue.add(jobType, data, options);
    this.emit('job-added', { queueName, job });
    
    return job;
  }

  /**
   * Get a specific queue
   */
  getQueue(name) {
    return this.queues.get(name);
  }

  /**
   * Get a specific worker
   */
  getWorker(name) {
    return this.workers.get(name);
  }

  /**
   * Get a specific DLQ
   */
  getDLQ(name) {
    return this.dlqs.get(name);
  }

  /**
   * Get comprehensive statistics for all queues
   */
  async getStats() {
    const stats = {
      queues: {},
      overall: {
        totalQueues: this.queues.size,
        totalJobs: 0,
        totalWaiting: 0,
        totalActive: 0,
        totalCompleted: 0,
        totalFailed: 0,
        totalDLQ: 0
      }
    };

    for (const [name, queue] of this.queues) {
      const [waiting, active, completed, failed] = await Promise.all([
        queue.getWaiting(),
        queue.getActive(),
        queue.getCompleted(),
        queue.getFailed()
      ]);

      const dlqStats = await this.dlqs.get(name).getStats();
      const processorStats = this.processors.get(name).getStats();

      const queueStats = {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        dlq: dlqStats,
        processor: processorStats
      };

      stats.queues[name] = queueStats;
      stats.overall.totalJobs += queueStats.waiting + queueStats.active + queueStats.completed + queueStats.failed;
      stats.overall.totalWaiting += queueStats.waiting;
      stats.overall.totalActive += queueStats.active;
      stats.overall.totalCompleted += queueStats.completed;
      stats.overall.totalFailed += queueStats.failed;
      stats.overall.totalDLQ += dlqStats.total;
    }

    return stats;
  }

  /**
   * Start health check monitoring
   */
  startHealthCheck() {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const health = await this.getHealth();
        this.emit('health-check', health);
        
        if (health.status === 'unhealthy') {
          console.warn('Queue system health check failed:', health.issues);
        }
      } catch (error) {
        console.error('Health check error:', error);
      }
    }, this.config.healthCheck.interval);
  }

  /**
   * Get system health status
   */
  async getHealth() {
    const stats = await this.getStats();
    const issues = [];
    const thresholds = this.config.healthCheck.thresholds;

    // Check Redis connection
    try {
      await this.redis.ping();
    } catch (error) {
      issues.push(`Redis connection failed: ${error.message}`);
    }

    // Check queue thresholds
    for (const [name, queueStats] of Object.entries(stats.queues)) {
      if (queueStats.waiting > thresholds.waiting) {
        issues.push(`Queue ${name} has ${queueStats.waiting} waiting jobs (threshold: ${thresholds.waiting})`);
      }
      
      if (queueStats.active > thresholds.active) {
        issues.push(`Queue ${name} has ${queueStats.active} active jobs (threshold: ${thresholds.active})`);
      }
      
      if (queueStats.failed > thresholds.failed) {
        issues.push(`Queue ${name} has ${queueStats.failed} failed jobs (threshold: ${thresholds.failed})`);
      }
    }

    return {
      status: issues.length === 0 ? 'healthy' : 'unhealthy',
      issues,
      stats,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Pause all queues
   */
  async pauseAll() {
    const pausePromises = Array.from(this.queues.values()).map(queue => queue.pause());
    await Promise.all(pausePromises);
    console.log('All queues paused');
  }

  /**
   * Resume all queues
   */
  async resumeAll() {
    const resumePromises = Array.from(this.queues.values()).map(queue => queue.resume());
    await Promise.all(resumePromises);
    console.log('All queues resumed');
  }

  /**
   * Gracefully shutdown all queues and workers
   */
  async shutdown() {
    console.log('Shutting down queue system...');
    
    // Stop health check
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    // Close workers
    const workerClosePromises = Array.from(this.workers.values()).map(worker => worker.close());
    await Promise.all(workerClosePromises);

    // Close queues
    const queueClosePromises = Array.from(this.queues.values()).map(queue => queue.close());
    await Promise.all(queueClosePromises);

    // Close queue events
    const eventClosePromises = Array.from(this.queueEvents.values()).map(events => events.close());
    await Promise.all(eventClosePromises);

    // Close DLQs
    const dlqClosePromises = Array.from(this.dlqs.values()).map(dlq => dlq.close());
    await Promise.all(dlqClosePromises);

    // Close Redis connection
    this.redis.disconnect();

    console.log('Queue system shutdown complete');
  }
}

/**
 * Example usage and job processors
 */
class ExampleJobProcessors {
  /**
   * Email sending job processor
   */
  static async processEmailJob(job) {
    const { to, subject, body, template } = job.data;
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate occasional failures
    if (Math.random() < 0.2) {
      throw new Error('Email service temporarily unavailable');
    }
    
    // Update job progress
    job.updateProgress(50);
    
    // More processing...
    await new Promise(resolve => setTimeout(resolve, 500));
    job.updateProgress(100);
    
    return {
      messageId: `msg_${Date.now()}`,
      to,
      subject,
      sentAt: new Date().toISOString()
    };
  }

  /**
   * Image processing job processor
   */
  static async processImageJob(job) {
    const { imageUrl, transformations } = job.data;
    
    // Simulate image processing
    for (let i = 0; i < transformations.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      job.updateProgress(((i + 1) / transformations.length) * 100);
    }
    
    return {
      originalUrl: imageUrl,
      processedUrl: `${imageUrl}_processed`,
      transformations,
      processedAt: new Date().toISOString()
    };
  }

  /**
   * Data processing job processor
   */
  static async processDataJob(job) {
    const { dataset, operation } = job.data;
    
    // Simulate data processing with progress updates
    const totalSteps = 10;
    for (let i = 0; i < totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      job.updateProgress((i + 1) / totalSteps * 100);
    }
    
    return {
      dataset,
      operation,
      result: `Processed ${dataset} with ${operation}`,
      processedAt: new Date().toISOString()
    };
  }
}

/**
 * Example usage function
 */
async function createExampleUsage() {
  const queueManager = new QueueManager({
    redis: {
      host: 'localhost',
      port: 6379
    },
    healthCheck: {
      enabled: true,
      interval: 5000
    }
  });

  try {
    // Create queues with different processors
    const { queue: emailQueue } = await queueManager.createQueue(
      'email',
      ExampleJobProcessors.processEmailJob,
      {
        worker: { concurrency: 2 },
        queue: {
          defaultJobOptions: {
            attempts: 5,
            backoff: { type: 'exponential', delay: 2000 }
          }
        }
      }
    );

    const { queue: imageQueue } = await queueManager.createQueue(
      'image',
      ExampleJobProcessors.processImageJob,
      {
        worker: { concurrency: 1 },
        queue: {
          defaultJobOptions: {
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 }
          }
        }
      }
    );

    // Setup event listeners
    queueManager.on('job-completed', ({ queueName, job, result }) => {
      console.log(`✅ Job completed in ${queueName}:`, job.id);
    });

    queueManager.on('job-failed', ({ queueName, job, error }) => {
      console.log(`❌ Job failed in ${queueName}:`, job.id, error.message);
    });

    queueManager.on('job-moved-to-dlq', ({ queueName, job }) => {
      console.log(`💀 Job moved to DLQ in ${queueName}:`, job.id);
    });

    queueManager.on('health-check', (health) => {
      if (health.status === 'unhealthy') {
        console.warn('🚨 Health check failed:', health.issues);
      }
    });

    // Add some jobs
    await queueManager.addJob('email', 'welcome-email', {
      to: 'user@example.com',
      subject: 'Welcome to our service!',
      template: 'welcome'
    }, { priority: 1 });

    await queueManager.addJob('email', 'newsletter', {
      to: 'subscriber@example.com',
      subject: 'Monthly Newsletter',
      template: 'newsletter'
    }, { priority: 2, delay: 5000 });

    await queueManager.addJob('image', 'resize', {
      imageUrl: 'https://example.com/image.jpg',
      transformations: ['resize', 'compress', 'watermark']
    });

    // Monitor stats
    setInterval(async () => {
      const stats = await queueManager.getStats();
      console.log('📊 Queue Stats:', JSON.stringify(stats, null, 2));
    }, 10000);

    // Graceful shutdown handling
    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM, shutting down gracefully...');
      await queueManager.shutdown();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('Received SIGINT, shutting down gracefully...');
      await queueManager.shutdown();
      process.exit(0);
    });

    console.log('🚀 Queue system started successfully!');
    
  } catch (error) {
    console.error('Failed to start queue system:', error);
    await queueManager.shutdown();
  }
}

// Export classes for use in your application
module.exports = {
  QueueManager,
  DeadLetterQueue,
  JobProcessor,
  ExampleJobProcessors,
  DEFAULT_CONFIG,
  createExampleUsage
};

// If running this file directly, run the example
if (require.main === module) {
  createExampleUsage().catch(console.error);
}