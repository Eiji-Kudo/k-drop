import type { DrizzleD1Database } from "drizzle-orm/d1";
import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";
import * as schema from "../../db/schema/index.ts";
import type { AppBindings } from "../bindings";

export type AppDatabase = DrizzleD1Database<typeof schema>;

export const getDatabase = (context: Context<AppBindings>): AppDatabase => {
	return drizzle(context.env.DB, { schema });
};
