import type { FastifyPluginAsync } from 'fastify';

import { assetRoutes } from './assets.js';
import { boardRoutes } from './boards.js';
import { projectRoutes } from './projects.js';
import { providerRoutes } from './providers.js';
import { runRoutes } from './runs.js';
import { systemRoutes } from './system.js';

export const apiRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(systemRoutes);
  await fastify.register(projectRoutes);
  await fastify.register(boardRoutes);
  await fastify.register(providerRoutes);
  await fastify.register(runRoutes);
  await fastify.register(assetRoutes);
};
