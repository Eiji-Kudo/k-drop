import { drizzle } from 'npm:drizzle-orm/postgres-js'
import postgres from 'npm:postgres'
import * as schema from './schema.ts'

const connectionString = Deno.env.get('DATABASE_URL') ?? ''

const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })
