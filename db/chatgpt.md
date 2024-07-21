Understood. You can manage raw SQL migration files manually and run them at the start of your Fastify server. Here’s a step-by-step guide on how to achieve this:

1. **Create a Migration Table**:
   First, create a table in your database to track which migrations have been applied. This table can be created manually or with a migration script:
   ```sql
   CREATE TABLE IF NOT EXISTS schema_migrations (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) UNIQUE NOT NULL,
     applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **Organize Your Migration Files**:
   Store your raw SQL migration files in a directory, e.g., `migrations/`. Name them sequentially to keep track of the order, such as `001_initial_schema.sql`, `002_add_users_table.sql`, etc.

3. **Write a Script to Apply Migrations**:
   Create a script in your Fastify project to apply pending migrations. This script will:
   - Read the migration files.
   - Check the `schema_migrations` table to see which migrations have been applied.
   - Apply any new migrations in the correct order.

4. **Fastify Integration**:
   Modify your Fastify server startup code to run the migration script before starting the server.

Here’s an example implementation:

### Directory Structure
```
your-project/
|-- migrations/
|   |-- 001_initial_schema.sql
|   |-- 002_add_users_table.sql
|-- server.js
|-- package.json
```

### Example Migration Files
**`migrations/001_initial_schema.sql`**:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255)
);
```

**`migrations/002_add_users_table.sql`**:
```sql
ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
```

### Migration Script
**`migrate.js`**:
```javascript
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const client = new Client({
  user: 'your_database_user',
  host: 'localhost',
  database: 'your_database_name',
  password: 'your_database_password',
  port: 5432,
});

const migrationsDir = path.join(__dirname, 'migrations');

async function runMigrations() {
  await client.connect();

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
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`Applied migration: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`Failed to apply migration: ${file}`, err);
        process.exit(1);
      }
    }
  }

  await client.end();
}

module.exports = runMigrations;
```

### Fastify Server Initialization
**`server.js`**:
```javascript
const fastify = require('fastify')();
const runMigrations = require('./migrate');

(async () => {
  await runMigrations();

  fastify.get('/users', async (request, reply) => {
    const client = new Client({
      user: 'your_database_user',
      host: 'localhost',
      database: 'your_database_name',
      password: 'your_database_password',
      port: 5432,
    });
    await client.connect();
    
    const res = await client.query('SELECT * FROM users');
    await client.end();
    
    reply.send(res.rows);
  });

  fastify.listen(3000, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
})();
```

With this setup:
1. **Migration Files**: You manually create and manage your `.sql` migration files in the `migrations` directory.
2. **Migration Script**: The `migrate.js` script applies any pending migrations by checking against the `schema_migrations` table.
3. **Fastify Initialization**: The Fastify server runs the migration script before starting, ensuring your database schema is up to date.
