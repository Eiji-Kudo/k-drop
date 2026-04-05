import type { Context } from "hono";

type DatabaseStatement = {
	first: <Result>(columnName?: string) => Promise<Result | null>;
};

export type DatabaseBinding = {
	prepare: (query: string) => DatabaseStatement;
};

export type AppBindings = {
	Bindings: {
		DB: DatabaseBinding;
	};
};

export const getDatabase = (context: Context<AppBindings>) => {
	return context.env.DB;
};
