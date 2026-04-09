import type { RunLogEntry } from '@hongflow/shared';

import { sql } from '../lib/db.js';
import { toJson } from '../lib/json.js';
import type { RunStatusUpdate } from './types.js';

export const appendRunLog = async (runId: string, entry: RunLogEntry) => {
  const [current] = await sql<{ logs: RunLogEntry[] }[]>`
    select logs
    from runs
    where id = ${runId}
  `;

  const logs = Array.isArray(current?.logs) ? [...current.logs, entry] : [entry];

  await sql`
    update runs
    set logs = ${sql.json(toJson(logs))}
    where id = ${runId}
  `;
};

export const updateRunStatus = async (runId: string, updates: RunStatusUpdate) => {
  await sql`
    update runs
    set
      status = ${updates.status},
      provider = coalesce(${updates.provider ?? null}, provider),
      started_at = case when ${updates.startedAt ?? false} then now() else started_at end,
      finished_at = case when ${updates.finishedAt ?? false} then now() else finished_at end,
      error = ${updates.error ?? null}
    where id = ${runId}
  `;
};
