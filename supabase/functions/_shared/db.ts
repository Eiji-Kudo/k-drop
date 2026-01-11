import { drizzle } from 'npm:drizzle-orm@0.38.3/postgres-js'
import postgres from 'npm:postgres@3.4.5'
import * as schema from './schema.ts'

const connectionString = Deno.env.get('DATABASE_URL') ?? ''

const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })
