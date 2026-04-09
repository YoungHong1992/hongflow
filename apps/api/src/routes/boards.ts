import type { FastifyPluginAsync } from 'fastify';

import { createBoardSchema, workflowDocumentSchema } from '@hongflow/shared';

import { sql } from '../lib/db.js';
import { toJson } from '../serializers/json.js';
import type { BoardRow } from '../types/rows.js';
import { defaultViewport, serializeDefaultWorkflow } from '../utils/workflow.js';

export const boardRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/boards', async (request, reply) => {
    const body = createBoardSchema.parse(request.body);
    const workflow = serializeDefaultWorkflow();

    const [board] = await sql<BoardRow[]>`
      insert into boards (project_id, name, viewport)
      values (${body.projectId}, ${body.name}, ${sql.json(toJson(defaultViewport))})
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
        ${workflow.schemaVersion},
        ${sql.json(workflow.nodes)},
        ${sql.json(workflow.edges)},
        ${sql.json(workflow.variables)}
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
};
