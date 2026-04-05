import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono()
	.basePath("/api")
	.use(secureHeaders())
	.get("/health", (context) => {
		return context.json({
			status: "ok",
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
