import type { D1Database, D1PreparedStatement } from "@cloudflare/workers-types/latest";
import type { Context } from "hono";

type DatabaseStatement = Pick<D1PreparedStatement, "first">;

export type DatabaseBinding = {
	prepare: (...args: Parameters<D1Database["prepare"]>) => DatabaseStatement;
};

export type AppBindings = {
	Bindings: {
		DB: DatabaseBinding;
	};
};

export const getDatabase = (context: Context<AppBindings>) => {
	return context.env.DB;
};
