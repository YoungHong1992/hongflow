import { Worker } from 'bullmq';
import { RUN_QUEUE_NAME, type RunLogEntry } from '@hongflow/shared';

import { env } from './env.js';
import { sql } from './lib/db.js';
import { redis } from './lib/queue.js';
import { executeRunJob } from './run/execute.js';
import { appendRunLog, updateRunStatus } from './run/logs.js';

const worker = new Worker(
  RUN_QUEUE_NAME,
  async (job: { data: { runId: string; provider?: string } }) => executeRunJob(job.data),
  {
    connection: redis,
    concurrency: env.WORKER_CONCURRENCY,
  },
);

worker.on('completed', async (job) => {
  if (!job) {
    return;
  }

  await appendRunLog(job.data.runId, {
    at: new Date().toISOString(),
    level: 'info',
    message: 'Run completed',
  });
});

worker.on('failed', async (job, error) => {
  if (!job) {
    return;
  }

  await appendRunLog(job.data.runId, {
    at: new Date().toISOString(),
    level: 'error',
    message: error.message,
  });

  await updateRunStatus(job.data.runId, {
    status: 'failed',
    finishedAt: true,
    error: error.message,
  });
});

console.info(`[hongflow-worker] listening on queue ${RUN_QUEUE_NAME}`);

const shutdown = async () => {
  await worker.close();
  await redis.quit();
  await sql.end({ timeout: 5 });
  process.exit(0);
};

process.on('SIGINT', () => {
  void shutdown();
});

process.on('SIGTERM', () => {
  void shutdown();
});
