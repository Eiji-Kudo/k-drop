import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import type { AppBindings } from "../../../functions/core/bindings";
import { getDatabase } from "../../../functions/core/db/bindings";

const timingSafeEqual = (a: string, b: string): boolean => {
	const lenA = a.length;
	const lenB = b.length;
	const len = Math.max(lenA, lenB);
	let result = lenA ^ lenB;
	for (let i = 0; i < len; i++) {
		result |= (i < lenA ? a.charCodeAt(i) : 0) ^ (i < lenB ? b.charCodeAt(i) : 0);
	}
	return result === 0;
};

const app = new Hono<AppBindings>()
	.basePath("/api")
	.use(secureHeaders())
	.use(async (context, next) => {
		if (context.env?.DB) {
			await context.env.DB.exec("PRAGMA foreign_keys = ON");
		}
		await next();
	})
	.get("/health", (context) => {
		return context.json({
			status: "ok",
		});
	})
	.get("/health/database", async (context) => {
		const expected = context.env.HEALTH_CHECK_TOKEN;
		if (!expected) {
			return context.json({ error: "Not Found" }, 404);
		}
		const token = context.req.header("X-Health-Token");
		if (!token || !timingSafeEqual(token, expected)) {
			return context.json({ error: "Not Found" }, 404);
		}
		try {
			const db = getDatabase(context.env.DB);
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
