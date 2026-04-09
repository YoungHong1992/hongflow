import { mkdir } from 'node:fs/promises';

import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import Fastify from 'fastify';

import { env, paths } from './env.js';
import { getDatabaseHealth, sql } from './lib/db.js';
import { runMigrations } from './lib/migrate.js';
import { getQueueHealth, redis, runQueue } from './lib/queue.js';
import { apiRoutes } from './routes/api.js';

const bootstrap = async () => {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: true,
  });

  await app.register(multipart, {
    limits: {
      fileSize: 25 * 1024 * 1024,
    },
  });

  await mkdir(paths.uploadDir, { recursive: true });
  await mkdir(paths.exportDir, { recursive: true });

  if (env.RUN_MIGRATIONS) {
    await runMigrations(app.log);
  }

  const healthHandler = async () => ({
    ok: true,
    app: 'hongflow-api',
    database: await getDatabaseHealth(),
    queue: await getQueueHealth(),
    now: new Date().toISOString(),
  });

  app.get('/health', healthHandler);
  app.register(apiRoutes, { prefix: '/api' });

  app.addHook('onClose', async () => {
    await runQueue.close();
    await redis.quit();
    await sql.end({ timeout: 5 });
  });

  await app.listen({
    host: env.API_HOST,
    port: env.API_PORT,
  });
};

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
