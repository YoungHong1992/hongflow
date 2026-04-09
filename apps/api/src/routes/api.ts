import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';

import type { FastifyPluginAsync } from 'fastify';

import { builtInNodeSpecs } from '@hongflow/nodes';
import {
  createBoardSchema,
  createProjectSchema,
  createRunSchema,
  providerConfigSchema,
  WORKFLOW_SCHEMA_VERSION,
  workflowDocumentSchema,
} from '@hongflow/shared';

import { env, paths } from '../env.js';
import { encryptSecret } from '../lib/crypto.js';
import { sql } from '../lib/db.js';
import { runQueue } from '../lib/queue.js';

const toJson = (value: unknown) => JSON.parse(JSON.stringify(value));

type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

type BoardRow = {
  id: string;
  projectId: string;
  name: string;
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  createdAt: string;
  updatedAt: string;
};

type RunRow = {
  id: string;
  workflowId: string;
  status: string;
  provider: string;
  startedAt: string | null;
  finishedAt: string | null;
  logs: Array<{ at: string; level: string; message: string }>;
  error: string | null;
  createdAt: string;
};

export const apiRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async () => ({
    ok: true,
    app: 'hongflow-api',
  }));

  fastify.get('/projects', async () => {
    const projects = await sql<ProjectRow[]>`
      select
        id,
        name,
        description,
        created_at as "createdAt",
        updated_at as "updatedAt"
      from projects
      order by created_at desc
    `;

    return { projects };
  });

  fastify.post('/projects', async (request, reply) => {
    const body = createProjectSchema.parse(request.body);
    const viewport = {
      x: 0,
      y: 0,
      zoom: 1,
    };

    const result = await sql.begin(async (transaction) => {
      const [project] = await transaction<ProjectRow[]>`
        insert into projects (name, description)
        values (${body.name}, ${body.description ?? null})
        returning
          id,
          name,
          description,
          created_at as "createdAt",
          updated_at as "updatedAt"
      `;

      if (!project) {
        throw new Error('Failed to create project');
      }

      const [board] = await transaction<BoardRow[]>`
        insert into boards (project_id, name, viewport)
        values (${project.id}, ${'Main Board'}, ${transaction.json(toJson(viewport))})
        returning
          id,
          project_id as "projectId",
          name,
          viewport,
          created_at as "createdAt",
          updated_at as "updatedAt"
      `;

      if (!board) {
        throw new Error('Failed to create default board');
      }

      await transaction`
        insert into workflows (board_id, schema_version, nodes, edges, variables)
        values (
          ${board.id},
          ${WORKFLOW_SCHEMA_VERSION},
          ${transaction.json(toJson([]))},
          ${transaction.json(toJson([]))},
          ${transaction.json(toJson({}))}
        )
      `;

      return { project, board };
    });

    reply.code(201);
    return result;
  });

  fastify.get('/projects/:id', async (request, reply) => {
    const params = request.params as { id: string };
    const [project] = await sql<ProjectRow[]>`
      select
        id,
        name,
        description,
        created_at as "createdAt",
        updated_at as "updatedAt"
      from projects
      where id = ${params.id}
    `;

    if (!project) {
      reply.code(404);
      return { message: 'Project not found' };
    }

    const boards = await sql<BoardRow[]>`
      select
        id,
        project_id as "projectId",
        name,
        viewport,
        created_at as "createdAt",
        updated_at as "updatedAt"
      from boards
      where project_id = ${params.id}
      order by created_at asc
    `;

    return { project, boards };
  });

  fastify.get('/projects/:id/assets', async (request) => {
    const params = request.params as { id: string };

    const assets = await sql`
      select
        id,
        project_id as "projectId",
        type,
        storage_path as "storagePath",
        metadata,
        thumbnail_path as "thumbnailPath",
        created_at as "createdAt"
      from assets
      where project_id = ${params.id}
      order by created_at desc
    `;

    return { assets };
  });

  fastify.post('/boards', async (request, reply) => {
    const body = createBoardSchema.parse(request.body);
    const viewport = {
      x: 0,
      y: 0,
      zoom: 1,
    };

    const [board] = await sql<BoardRow[]>`
      insert into boards (project_id, name, viewport)
      values (${body.projectId}, ${body.name}, ${sql.json(toJson(viewport))})
      returning
        id,
        project_id as "projectId",
        name,
        viewport,
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    if (!board) {
      throw new Error('Failed to create board');
    }

    await sql`
      insert into workflows (board_id, schema_version, nodes, edges, variables)
      values (
        ${board.id},
        ${WORKFLOW_SCHEMA_VERSION},
        ${sql.json(toJson([]))},
        ${sql.json(toJson([]))},
        ${sql.json(toJson({}))}
      )
    `;

    reply.code(201);
    return { board };
  });

  fastify.get('/boards/:id/workflow', async (request, reply) => {
    const params = request.params as { id: string };

    const [workflow] = await sql`
      select
        w.id,
        w.board_id as "boardId",
        w.schema_version as "schemaVersion",
        w.nodes,
        w.edges,
        w.variables,
        b.viewport
      from workflows w
      join boards b on b.id = w.board_id
      where b.id = ${params.id}
    `;

    if (!workflow) {
      reply.code(404);
      return { message: 'Workflow not found' };
    }

    return { workflow };
  });

  fastify.put('/boards/:id/workflow', async (request, reply) => {
    const params = request.params as { id: string };
    const body = workflowDocumentSchema.parse(request.body);

    const [existing] = await sql`
      select id
      from workflows
      where board_id = ${params.id}
    `;

    if (!existing) {
      reply.code(404);
      return { message: 'Workflow not found' };
    }

    await sql.begin(async (transaction) => {
      await transaction`
        update boards
        set viewport = ${transaction.json(toJson(body.viewport))}, updated_at = now()
        where id = ${params.id}
      `;

      await transaction`
        update workflows
        set
          schema_version = ${body.schemaVersion},
          nodes = ${transaction.json(toJson(body.nodes))},
          edges = ${transaction.json(toJson(body.edges))},
          variables = ${transaction.json(toJson(body.variables))},
          updated_at = now()
        where board_id = ${params.id}
      `;
    });

    reply.code(204);
  });

  fastify.get('/node-catalog', async () => ({
    nodes: builtInNodeSpecs.map((node) => ({
      type: node.type,
      title: node.title,
      description: node.description,
      category: node.category,
    })),
  }));

  fastify.post('/providers/config', async (request, reply) => {
    const body = providerConfigSchema.parse(request.body);
    const encryptedKey = encryptSecret(body.apiKey, env.APP_SECRET);

    const [providerConfig] = await sql`
      insert into provider_configs (provider, encrypted_key, endpoint, model_defaults)
      values (
        ${body.provider},
        ${encryptedKey},
        ${body.endpoint ?? null},
        ${sql.json(toJson(body.modelDefaults))}
      )
      on conflict (provider)
      do update set
        encrypted_key = excluded.encrypted_key,
        endpoint = excluded.endpoint,
        model_defaults = excluded.model_defaults,
        updated_at = now()
      returning
        id,
        provider,
        endpoint,
        model_defaults as "modelDefaults",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    reply.code(201);
    return { providerConfig };
  });

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

  fastify.post('/assets/upload', async (request, reply) => {
    const file = await request.file();

    if (!file) {
      reply.code(400);
      return { message: 'File is required' };
    }

    const fields = file.fields as Record<string, { value?: string }>;
    const projectId = fields.projectId?.value;
    const assetType = fields.type?.value;

    if (!projectId || !assetType) {
      reply.code(400);
      return { message: 'projectId and type are required multipart fields' };
    }

    const safeFilename = file.filename.replace(/[^a-zA-Z0-9._-]/g, '-');
    const targetDirectory = `${paths.uploadDir}/${projectId}`;
    const storagePath = `${targetDirectory}/${Date.now()}-${safeFilename}`;

    await mkdir(targetDirectory, { recursive: true });
    await pipeline(file.file, createWriteStream(storagePath));

    const [asset] = await sql`
      insert into assets (project_id, type, storage_path, metadata)
      values (
        ${projectId},
        ${assetType},
        ${storagePath},
        ${sql.json(toJson({
          filename: file.filename,
          mimetype: file.mimetype,
          encoding: file.encoding,
          fieldname: file.fieldname,
        }))}
      )
      returning
        id,
        project_id as "projectId",
        type,
        storage_path as "storagePath",
        metadata,
        thumbnail_path as "thumbnailPath",
        created_at as "createdAt"
    `;

    reply.code(201);
    return { asset };
  });
};
