import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';

import type { FastifyPluginAsync } from 'fastify';

import { paths } from '../env.js';
import { sql } from '../lib/db.js';
import { toJson } from '../serializers/json.js';

export const assetRoutes: FastifyPluginAsync = async (fastify) => {
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
