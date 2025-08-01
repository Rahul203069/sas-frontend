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


export const smsreplyqueue = new Queue('smsreply', {
  connection,
});

smsreplyqueue.waitUntilReady().then(() => {
  console.log(`✅ Queue "${smsreplyqueue.name}" is ready and connected to Redis`);
}).catch(err => {
  console.error('❌ Queue connection failed:', err);
});



smsreplyqueue.on('error', (err) => {
  console.error('Queue encountered an error:', err);        
});



smsreplyqueue.on('waiting', (jobId) => {
  console.log(`Job ${jobId} is waiting to be processed`);
});





export const initializeconvoqueue = new Queue('initial-sms', {
  connection,
});

initializeconvoqueue.waitUntilReady().then(() => {
  console.log(`✅ Queue "${initializeconvoqueue.name}" is ready and connected to Redis`);
}).catch(err => {
  console.error('❌ Queue connection failed:', err);
});



initializeconvoqueue.on('error', (err) => {
  console.error('Queue encountered an error:', err);        
});



initializeconvoqueue.on('waiting', (jobId) => {
  console.log(`Job ${jobId} is waiting to be processed`);
});











