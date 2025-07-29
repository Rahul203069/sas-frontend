import IORedis from 'ioredis';
import { Queue } from 'bullmq';
import { Worker } from 'bullmq';


export const connection = new IORedis({
  host: 'redis-14719.c52.us-east-1-4.ec2.redns.redis-cloud.com',
  port: 14719,
  username: 'default',
  password: 'yQyAarXGbqeLyXH71c1zzBUXGIupoj4H',
   
  maxRetriesPerRequest: null, // Disable automatic retries
});


export const myQueue = new Queue('smsreply', {
  connection,
});

myQueue.waitUntilReady().then(() => {
  console.log(`✅ Queue "${myQueue.name}" is ready and connected to Redis`);
}).catch(err => {
  console.error('❌ Queue connection failed:', err);
});



myQueue.on('error', (err) => {
  console.error('Queue encountered an error:', err);        
});



myQueue.on('waiting', (jobId) => {
  console.log(`Job ${jobId} is waiting to be processed`);
});





const worker = new Worker('my-queue', async (job) => {
  console.log('Processing job:', job.name, job.data);
}, {
  connection,
});


worker.on('ready', () => {
  console.log('Worker is ready to process jobs');
});
worker.on('failed', (job, err) => {
  console.error(`Job ${job} failed with error:`, err);
});
worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});
worker.on('error', (err) => {
  console.error('Worker encountered an error:', err);
});
