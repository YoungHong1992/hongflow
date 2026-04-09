import type { FastifyPluginAsync } from 'fastify';

import { builtInNodeSpecs } from '@hongflow/nodes';

export const systemRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async () => ({
    ok: true,
    app: 'hongflow-api',
  }));

  fastify.get('/node-catalog', async () => ({
    nodes: builtInNodeSpecs.map((node) => ({
      type: node.type,
      title: node.title,
      description: node.description,
      category: node.category,
    })),
  }));
};
