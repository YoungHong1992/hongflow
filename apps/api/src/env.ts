import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_SECRET: z.string().min(8).default('change-me-in-production'),
  DATABASE_URL: z.string().default('postgresql://hongflow:hongflow@localhost:5432/hongflow'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  API_HOST: z.string().default('0.0.0.0'),
  API_PORT: z.coerce.number().int().positive().default(3001),
  RUN_MIGRATIONS: z.coerce.boolean().default(true),
  UPLOAD_DIR: z.string().default('./data/uploads'),
  EXPORT_DIR: z.string().default('./data/exports'),
});

export const env = envSchema.parse(process.env);

const currentDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(currentDir, '../../..');

export const paths = {
  workspaceRoot,
  uploadDir: resolve(workspaceRoot, env.UPLOAD_DIR),
  exportDir: resolve(workspaceRoot, env.EXPORT_DIR),
};
