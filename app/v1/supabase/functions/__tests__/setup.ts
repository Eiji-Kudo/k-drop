import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../../../drizzle/schema'
import * as fs from 'fs'
import * as path from 'path'

let container: StartedPostgreSqlContainer
let client: postgres.Sql
let db: PostgresJsDatabase<typeof schema>

export async function setupTestDatabase(): Promise<
  PostgresJsDatabase<typeof schema>
> {
  container = await new PostgreSqlContainer('postgres:15')
    .withDatabase('test_db')
    .withUsername('test_user')
    .withPassword('test_password')
    .start()

  const connectionString = container.getConnectionUri()
  client = postgres(connectionString, { max: 1 })
  db = drizzle(client, { schema })

  await applyMigrations(client)

  return db
}

async function applyMigrations(sql: postgres.Sql): Promise<void> {
  await sql.unsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated;
      END IF;
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
        CREATE ROLE anon;
      END IF;
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_role') THEN
        CREATE ROLE service_role;
      END IF;
    END
    $$;
  `)

  await sql.unsafe(`
    CREATE SCHEMA IF NOT EXISTS auth;

    CREATE OR REPLACE FUNCTION auth.uid()
    RETURNS uuid AS $$
    BEGIN
      RETURN '00000000-0000-0000-0000-000000000000'::uuid;
    END;
    $$ LANGUAGE plpgsql;
  `)

  const migrationsDir = path.join(__dirname, '../../../supabase/migrations')
  const files = fs.readdirSync(migrationsDir).sort()

  for (const file of files) {
    if (file.endsWith('.sql')) {
      const migrationPath = path.join(migrationsDir, file)
      const migration = fs.readFileSync(migrationPath, 'utf-8')
      await sql.unsafe(migration)
    }
  }
}

export async function teardownTestDatabase(): Promise<void> {
  if (client) {
    await client.end()
  }
  if (container) {
    await container.stop()
  }
}

export function getTestDb(): PostgresJsDatabase<typeof schema> {
  if (!db) {
    throw new Error(
      'Test database not initialized. Call setupTestDatabase() first.',
    )
  }
  return db
}

export { schema }
