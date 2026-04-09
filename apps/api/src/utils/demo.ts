import type { ProjectRow } from '../types/rows.js';

export const fallbackProject = (): ProjectRow => {
  const now = new Date().toISOString();

  return {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'HongFlow Demo',
    description: 'Fallback project used when the database is unavailable.',
    createdAt: now,
    updatedAt: now,
  };
};
