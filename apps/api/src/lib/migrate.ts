import { readdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { FastifyBaseLogger } from 'fastify';

import { sql } from './db.js';

const currentDir = dirname(fileURLToPath(import.meta.url));
const migrationsDir = resolve(currentDir, '../../migrations');

export const runMigrations = async (logger?: FastifyBaseLogger) => {
  await sql`
    create table if not exists schema_migrations (
      name text primary key,
      executed_at timestamptz not null default now()
    )
  `;

  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort((left, right) => left.localeCompare(right));

  for (const file of files) {
    const alreadyApplied = await sql<{ name: string }[]>`
      select name
      from schema_migrations
      where name = ${file}
    `;

    if (alreadyApplied.length > 0) {
      continue;
    }

    const statement = await readFile(resolve(migrationsDir, file), 'utf8');

    await sql.begin(async (transaction) => {
      await transaction.unsafe(statement);
      await transaction`
        insert into schema_migrations (name)
        values (${file})
      `;
    });

    logger?.info({ migration: file }, 'Applied database migration');
  }
};
