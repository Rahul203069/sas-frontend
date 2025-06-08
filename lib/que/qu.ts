//@ts-nocheck
import { Queue, QueueOptions } from 'bullmq';
import { getRedisConnection } from './redis';


const smsQueueOptions: QueueOptions = {
  connection: getRedisConnection(),
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 25,
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 5000,
    },
  },
};

export const createsmsQueue = () => 
  new Queue<ImageProcessingJobData>('send-initial-sms', smsQueueOptions);
