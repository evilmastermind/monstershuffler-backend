import fs from 'fs';
import path from 'path';
import cron from 'node-cron';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const migrationsDir = path.join(__dirname, 'migrations');

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

  const appliedMigrations = await client.query('SELECT name FROM schema_migrations');
  const appliedMigrationNames = appliedMigrations.rows.map(row => row.name);

  const migrationFiles = fs.readdirSync(migrationsDir).sort();

  for (const file of migrationFiles) {
    if (!appliedMigrationNames.includes(file)) {
      console.info(` ===> Applying migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.info(`Applied migration: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`Failed to apply migration: ${file}`, err);
        process.exit(1);
      }
    }
  }

  await client.end();
}


export async function scheduleDbMaintenance() {
  // Run this every Sunday at midnight '0 0 * * Sunday'
  cron.schedule('0 0 * * Sunday', async () => {
    await client.connect();
    await setSearchPath();
    // Delete NPCs without a backstory that are older than a month
    await client.query('DELETE FROM npcs WHERE hasbackstory = false AND datecreated < NOW() - INTERVAL \'1 month\'');
    console.info('----MAINTENANCE: Deleted old NPCs without a backstory');
    await client.end();
  });
}
