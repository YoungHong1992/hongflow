import type { FastifyPluginAsync } from 'fastify';

import { providerConfigSchema } from '@hongflow/shared';

import { env } from '../env.js';
import { encryptSecret } from '../lib/crypto.js';
import { sql } from '../lib/db.js';
import { toJson } from '../serializers/json.js';

export const providerRoutes: FastifyPluginAsync = async (fastify) => {
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
};
