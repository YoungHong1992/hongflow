import postgres from 'postgres';

import { env } from '../env.js';

export const sql = postgres(env.DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
});

export const getDatabaseHealth = async (): Promise<'up' | 'down'> => {
  try {
    await sql`select 1`;
    return 'up';
  } catch {
    return 'down';
  }
};
