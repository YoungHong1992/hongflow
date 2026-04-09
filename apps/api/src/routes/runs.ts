import type { FastifyPluginAsync } from 'fastify';

import { createRunSchema } from '@hongflow/shared';

import { sql } from '../lib/db.js';
import { runQueue } from '../lib/queue.js';
import { toJson } from '../serializers/json.js';
import type { RunRow } from '../types/rows.js';

export const runRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/runs', async (request, reply) => {
    const body = createRunSchema.parse(request.body);
    const [workflow] = await sql`
      select id
      from workflows
      where id = ${body.workflowId}
    `;

    if (!workflow) {
      reply.code(404);
      return { message: 'Workflow not found' };
    }

    const logs = [
      {
        at: new Date().toISOString(),
        level: 'info',
        message: 'Run queued',
      },
    ];

    const [run] = await sql<RunRow[]>`
      insert into runs (workflow_id, status, provider, logs)
      values (
        ${body.workflowId},
        ${'queued'},
        ${body.provider},
        ${sql.json(toJson(logs))}
      )
      returning
        id,
        workflow_id as "workflowId",
        status,
        provider,
        started_at as "startedAt",
        finished_at as "finishedAt",
        logs,
        error,
        created_at as "createdAt"
    `;

    if (!run) {
      throw new Error('Failed to enqueue run');
    }

    await runQueue.add(
      'run.execute',
      {
        runId: run.id,
        provider: body.provider,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );

    reply.code(201);
    return { run };
  });

  fastify.get('/runs/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const [run] = await sql<RunRow[]>`
      select
        id,
        workflow_id as "workflowId",
        status,
        provider,
        started_at as "startedAt",
        finished_at as "finishedAt",
        logs,
        error,
        created_at as "createdAt"
      from runs
      where id = ${params.id}
    `;

    if (!run) {
      reply.code(404);
      return { message: 'Run not found' };
    }

    return { run };
  });

  fastify.get('/runs/:id/results', async (request) => {
    const params = request.params as { id: string };
    const results = await sql`
      select
        v.id,
        v.score,
        v.is_favorite as "isFavorite",
        a.id as "assetId",
        a.storage_path as "storagePath",
        a.metadata
      from variants v
      join assets a on a.id = v.asset_id
      where v.run_id = ${params.id}
      order by v.created_at asc
    `;

    return { results };
  });
};
