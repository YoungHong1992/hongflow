import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

import { RUN_QUEUE_NAME } from '@hongflow/shared';

import { env } from '../env.js';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const runQueue = new Queue(RUN_QUEUE_NAME, {
  connection: redis,
});

export const getQueueHealth = async (): Promise<'up' | 'down'> => {
  try {
    const result = await redis.ping();
    return result === 'PONG' ? 'up' : 'down';
  } catch {
    return 'down';
  }
};
