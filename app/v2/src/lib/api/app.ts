import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { type AppBindings, getDatabase } from "../../../functions/core/db/bindings";

const app = new Hono<AppBindings>()
	.basePath("/api")
	.use(secureHeaders())
	.get("/health", (context) => {
		return context.json({
			status: "ok",
		});
	})
	.get("/health/database", async (context) => {
		const result = await getDatabase(context).prepare("SELECT 1 AS ok").first<{ ok: number }>();

		if (result == null) {
			return context.json({ status: "error", database: "d1", reason: "query returned no rows" }, 503);
		}

		if (result.ok !== 1) {
			return context.json({ status: "error", database: "d1", reason: "unexpected query result" }, 503);
		}

		return context.json({
			status: "ok",
			database: "d1",
		});
	});

app.notFound((context) => {
	return context.json({ error: "Not Found" }, 404);
});

app.onError((err, context) => {
	console.error(err);
	return context.json({ error: "Internal Server Error" }, 500);
});

export type AppType = typeof app;

export { app };
