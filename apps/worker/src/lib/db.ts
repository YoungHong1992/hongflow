import postgres from 'postgres';

import { env } from '../env.js';

export const sql = postgres(env.DATABASE_URL, {
  max: 8,
  idle_timeout: 20,
});
