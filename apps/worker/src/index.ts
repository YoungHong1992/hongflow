import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import postgres from 'postgres';

import { resolveProvider } from '@hongflow/providers';
import { RUN_QUEUE_NAME, type RunLogEntry } from '@hongflow/shared';

import { env } from './env.js';

const sql = postgres(env.DATABASE_URL, {
  max: 8,
  idle_timeout: 20,
});

const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const toJson = (value: unknown) => JSON.parse(JSON.stringify(value));

const appendRunLog = async (runId: string, entry: RunLogEntry) => {
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

const updateRunStatus = async (
  runId: string,
  updates: {
    status: string;
    provider?: string;
    startedAt?: boolean;
    finishedAt?: boolean;
    error?: string | null;
  },
) => {
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

type WorkflowRow = {
  workflowId: string;
  projectId: string;
  nodes: Array<Record<string, unknown>>;
};

const resolvePrompt = (nodes: Array<Record<string, unknown>>) => {
  const promptNode = nodes.find((node) => node.type === 'Text.Prompt');

  if (!promptNode || typeof promptNode !== 'object') {
    return 'premium product hero shot, commercial lighting, clean composition';
  }

  const data = promptNode.data as Record<string, unknown> | undefined;
  return typeof data?.prompt === 'string'
    ? data.prompt
    : 'premium product hero shot, commercial lighting, clean composition';
};

const worker = new Worker(
  RUN_QUEUE_NAME,
  async (job: { data: { runId: string; provider?: string } }) => {
    const providerId = job.data.provider ?? env.IMAGE_PROVIDER;

    await updateRunStatus(job.data.runId, {
      status: 'running',
      provider: providerId,
      startedAt: true,
    });

    await appendRunLog(job.data.runId, {
      at: new Date().toISOString(),
      level: 'info',
      message: `Run started with provider ${providerId}`,
    });

    const [workflow] = await sql<WorkflowRow[]>`
      select
        r.workflow_id as "workflowId",
        b.project_id as "projectId",
        w.nodes
      from runs r
      join workflows w on w.id = r.workflow_id
      join boards b on b.id = w.board_id
      where r.id = ${job.data.runId}
    `;

    if (!workflow) {
      throw new Error(`Workflow not found for run ${job.data.runId}`);
    }

    const provider = resolveProvider(providerId);
    const prompt = resolvePrompt(workflow.nodes ?? []);
    const result = await provider.generateImage(
      {
        prompt,
        count: 4,
        width: 1024,
        height: 1024,
      },
      env.OPENAI_API_KEY ? { apiKey: env.OPENAI_API_KEY } : undefined,
    );

    for (const image of result.images) {
      const [asset] = await sql<{ id: string }[]>`
        insert into assets (project_id, type, storage_path, metadata)
        values (
          ${workflow.projectId},
          ${'output'},
          ${image.localPath ?? image.url ?? ''},
          ${sql.json(toJson(image.metadata ?? {}))}
        )
        returning id
      `;

      if (!asset) {
        throw new Error('Failed to persist generated asset');
      }

      await sql`
        insert into variants (run_id, asset_id, score, is_favorite)
        values (${job.data.runId}, ${asset.id}, ${0.0}, ${false})
      `;
    }

    await appendRunLog(job.data.runId, {
      at: new Date().toISOString(),
      level: 'info',
      message: `Generated ${result.images.length} output variants`,
    });

    await updateRunStatus(job.data.runId, {
      status: 'completed',
      provider: providerId,
      finishedAt: true,
      error: null,
    });

    return {
      generated: result.images.length,
      provider: providerId,
    };
  },
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
