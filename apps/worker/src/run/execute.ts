import { resolveProvider } from '@hongflow/providers';

import { env } from '../env.js';
import { sql } from '../lib/db.js';
import { toJson } from '../lib/json.js';
import { appendRunLog, updateRunStatus } from './logs.js';
import { resolvePrompt } from './prompt.js';
import type { WorkflowRow } from './types.js';

export const executeRunJob = async (jobData: { runId: string; provider?: string }) => {
  const providerId = jobData.provider ?? env.IMAGE_PROVIDER;

  await updateRunStatus(jobData.runId, {
    status: 'running',
    provider: providerId,
    startedAt: true,
  });

  await appendRunLog(jobData.runId, {
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
    where r.id = ${jobData.runId}
  `;

  if (!workflow) {
    throw new Error(`Workflow not found for run ${jobData.runId}`);
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
      values (${jobData.runId}, ${asset.id}, ${0.0}, ${false})
    `;
  }

  await appendRunLog(jobData.runId, {
    at: new Date().toISOString(),
    level: 'info',
    message: `Generated ${result.images.length} output variants`,
  });

  await updateRunStatus(jobData.runId, {
    status: 'completed',
    provider: providerId,
    finishedAt: true,
    error: null,
  });

  return {
    generated: result.images.length,
    provider: providerId,
  };
};
