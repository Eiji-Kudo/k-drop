import type { D1Database } from "@cloudflare/workers-types/latest";

export type AppBindings = {
	Bindings: {
		DB: D1Database;
	};
};
