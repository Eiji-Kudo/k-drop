import type { D1Database } from "@cloudflare/workers-types/latest";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../../db/schema/index.ts";

export type AppDatabase = DrizzleD1Database<typeof schema>;

export const getDatabase = (d1: D1Database): AppDatabase => {
	return drizzle(d1, { schema });
};
