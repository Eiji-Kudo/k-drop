import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import type { AppBindings } from "../../../functions/core/bindings";
import { getDatabase } from "../../../functions/core/db/bindings";

const app = new Hono<AppBindings>()
	.basePath("/api")
	.use(secureHeaders())
	.get("/health", (context) => {
		return context.json({
			status: "ok",
		});
	})
	.get("/health/database", async (context) => {
		try {
			const db = getDatabase(context);
			const result = await db.get<{ ok: number }>(sql`SELECT 1 AS ok`);

			if (result == null || result.ok !== 1) {
				console.error("D1 health check failed", { result });
				return context.json({ status: "error" }, 503);
			}

			return context.json({ status: "ok" });
		} catch (error) {
			console.error("D1 health check exception", error);
			return context.json({ status: "error" }, 503);
		}
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
