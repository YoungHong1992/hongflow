import { runMigrations } from '../lib/migrate.js';
import { sql } from '../lib/db.js';

runMigrations()
  .then(async () => {
    await sql.end({ timeout: 5 });
  })
  .catch(async (error) => {
    console.error(error);
    await sql.end({ timeout: 5 });
    process.exit(1);
  });
