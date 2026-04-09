import type { FastifyPluginAsync } from 'fastify';

import { createProjectSchema } from '@hongflow/shared';

import { sql } from '../lib/db.js';
import { toJson } from '../serializers/json.js';
import type { BoardRow, ProjectRow } from '../types/rows.js';
import { fallbackProject } from '../utils/demo.js';
import { defaultViewport, serializeDefaultWorkflow } from '../utils/workflow.js';

export const projectRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/projects', async () => {
    try {
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
    } catch (error) {
      fastify.log.warn({ error }, 'Database unavailable, serving fallback project list');
      return {
        projects: [fallbackProject()],
        degraded: true,
      };
    }
  });

  fastify.post('/projects', async (request, reply) => {
    const body = createProjectSchema.parse(request.body);
    const workflow = serializeDefaultWorkflow();

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
        values (${project.id}, ${'Main Board'}, ${transaction.json(toJson(defaultViewport))})
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
          ${workflow.schemaVersion},
          ${transaction.json(workflow.nodes)},
          ${transaction.json(workflow.edges)},
          ${transaction.json(workflow.variables)}
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
};
