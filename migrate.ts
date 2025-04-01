import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
// @ts-expect-error module-alias is not typed
import moduleAlias from 'module-alias';
////
moduleAlias.addAliases({
  '@': path.join(__dirname),
  '~': path.join(__dirname, 'modules'),
});

import fs from 'fs';
import cron from 'node-cron';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const migrationsDir = path.join(__dirname, 'resources/migrations');

async function setSearchPath() {
  const schema = process.env.DATABASE_URL?.split('=').pop();
  if (schema) {
    await client.query(`SET search_path TO ${schema}`);
  }
}

export async function runMigrations() {
  await client.connect();
  await setSearchPath();

  // Ensure the schema_migrations table exists
  await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
  `);

  const appliedMigrations = await client.query(
    'SELECT name FROM schema_migrations'
  );
  const appliedMigrationNames = new Set(
    appliedMigrations.rows.map((row) => row.name)
  );

  const migrationFiles = fs.readdirSync(migrationsDir).sort();

  for (const file of migrationFiles) {
    if (appliedMigrationNames.has(file)) {
      // console.info(`Skipping already applied migration: ${file}`);
      continue;
    }
    console.info(` ===> Applying migration: ${file}`);
    const filePath = path.join(migrationsDir, file);
    const ext = path.extname(file);

    try {
      await client.query('BEGIN');

      if (ext === '.sql') {
        const sql = fs.readFileSync(filePath, 'utf8');
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [
          file,
        ]);
      } else if (ext === '.js' || ext === '.ts') {
        const migrationModule = await import(filePath);
        await migrationModule.default(client);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [
          file,
        ]);
      } else {
        throw new Error(`Unknown migration type: ${file}`);
      }

      await client.query('COMMIT');
      console.info(` ✅ Applied migration: ${file}`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(` ❌ Failed to apply migration: ${file}`, err);
      process.exit(1);
    }
  }

  await client.end();
  console.info('🌈 All migrations applied successfully');
}

// TODO: you need to handle cron jobs like migrations.
// create a cronjobs table and insert the job name, so you
// can create/delete jobs when needed
export async function scheduleDbMaintenance() {
  // Run this every Sunday at midnight '0 0 * * Sunday'
  const job = cron.schedule('0 0 * * Sunday', async () => {
    await client.connect();
    await setSearchPath();
    // Delete NPCs without a backstory that are older than a month
    await client.query(
      'DELETE FROM objects WHERE type = 7 AND id IN ( 	SELECT n.objectid 	FROM npcs n JOIN npcsbackstories b 	WHERE n.datecreated < NOW() - INTERVAL \'1 month\' 	AND b.id IS NULL );'
    );
    console.info('----MAINTENANCE: Deleted old NPCs without a backstory');
    await client.end();
  });
}

async function main() {
  await runMigrations();
  await scheduleDbMaintenance();
  process.exit(0);
}

main();
