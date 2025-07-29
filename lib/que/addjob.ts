// lib/add-email-job.ts
import { Queue, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';

// Types
interface EmailJobData {
  to: string;
  subject: string;
  body: string;
  template?: string;
  from?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

interface JobResult {
  success: boolean;
  jobId: string;
  queueName: string;

  name: string;
}

// Redis connection (same config as your worker)
const redis = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: process.env.REDIS_DB ? Number(process.env.REDIS_DB) : 0,
    maxRetriesPerRequest: 3,
    lazyConnect: true
});

// Create email queue instance (matches your worker config)
const emailQueue = new Queue('email', {
  connection: redis,
defaultJobOptions: {
      removeOnComplete: 100,  // Keep last 100 completed jobs
      removeOnFail: 50,       // Keep last 50 failed jobs
      attempts: 3,            // Maximum retry attempts
      backoff: {
        type: 'exponential',
        delay: 1000,          // Base delay in milliseconds
            // Maximum delay cap
      },
      delay: 0,               // Initial delay
      priority: 0             // Job priority (higher = more priority)
    },
  
});

/**
 * Add an email job to the email queue
 * @param jobType - Type of email job (e.g., 'welcome-email', 'newsletter', 'password-reset')
 * @param emailData - Email data containing recipient, subject, body, etc.
 * @param options - Additional job options (priority, delay, etc.)
 * @returns Promise with job result
 */
export async function AddJobToQueue(
  name: string,
  emailData: any,
  options: JobsOptions = {}
): Promise<JobResult> {
  try {
    const job = await emailQueue.add(name, emailData, options);

    console.log(`Email job ${job.id} added to queue:`, {
      type: name,
      to: emailData.to,
      subject: emailData.subject,
      options: job.opts
    });
    return {
      success: true,
      jobId: job.id!,
      queueName: 'email',
   
      name
    };
    
    } catch (error) {
      console.error('Failed to add email job:', error);
      throw error;
    }
  }