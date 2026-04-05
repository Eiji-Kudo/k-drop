import { Hono } from "hono";

const app = new Hono().basePath("/api");

app.get("/health", (context) => {
	return context.json({
		status: "ok",
	});
});

export type AppType = typeof app;

export { app };
