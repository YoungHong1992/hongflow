import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().default('postgresql://hongflow:hongflow@localhost:5432/hongflow'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(2),
  IMAGE_PROVIDER: z.string().default('mock'),
  OPENAI_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
