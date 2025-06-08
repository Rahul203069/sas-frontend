//@ts-nocheck
import { Redis } from 'ioredis';

let redis: Redis | null = null;

const createRedisConnection = (): Redis => {
  if (redis) return redis;

  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
maxRetriesPerRequest: null,
    lazyConnect: true,
    keepAlive: 30000,
    family: 4,
    db: parseInt(process.env.REDIS_DB || '0'),
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
  });

  redis.on('ready', () => {
    console.log('🚀 Redis is ready');
  });

  return redis;
};

export const getRedisConnection = () => createRedisConnection();

export const disconnectRedis = async (): Promise<void> => {
  if (redis) {
    await redis.quit();
    redis = null;
  }
};

