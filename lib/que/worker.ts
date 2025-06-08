//@ts-nocheck
import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Prisma, PrismaClient } from '@prisma/client';
import { send } from 'process';
import { sendSMS } from '@/functions/sendsms';
const prisma = new PrismaClient
const connection = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    lazyConnect: true,
    keepAlive: 30000,
    family: 4,
    db: parseInt(process.env.REDIS_DB || '0'),
  });


export const worker =async ()=>{
    
    const work=new Worker(
  'send-initial-sms',
async job => {
  let twilio;
  if (job.name === 'send-initial-sms') {
    const userId = job.data.userId;
    twilio = await prisma.user.findFirst({
      where: { id: userId },
      select: { twilio: true }
    });


  }
  
  console.log('twilio', twilio);

  const lead = await prisma.lead.findUnique({ where: { id: job.data.leadId.id } });
  console.log(job.data,'job data');
  await sendSMS(`Hello ${lead.name}, i hope you doing well just want to clarify if you house at ${lead.address}`,lead.phone[0], twilio?.twilio?.metadata);
},




  { connection }
);

// Optional: handle failures
work.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

work.on('completed', (job) => {
  console.log(`Job ${job.id} completed.`);
});}
