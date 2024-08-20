import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const migrationsDir = path.join(__dirname, 'migrations');

export async function runMigrations() {
  await client.connect();

  const schema = process.env.DATABASE_URL?.split('=').pop();
  if (schema) {
    await client.query(`SET search_path TO ${schema}`);
  }

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
