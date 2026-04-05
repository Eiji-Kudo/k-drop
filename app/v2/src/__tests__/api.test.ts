// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { app } from "@/lib/api/app";
import type { AppBindings } from "../../functions/core/db/bindings";

describe("API", () => {
	it("returns a health check response", async () => {
		const response = await app.request("/api/health");

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			status: "ok",
		});
	});

	it("checks the D1 binding through the health endpoint", async () => {
		const first = vi.fn().mockResolvedValue({ ok: 1 });
		const env = {
			DB: {
				prepare: vi.fn(() => ({ first })),
			},
		} satisfies AppBindings["Bindings"];

		const response = await app.request("/api/health/database", undefined, env);

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			status: "ok",
			database: "d1",
		});
		expect(env.DB.prepare).toHaveBeenCalledWith("SELECT 1 AS ok");
	});

	it("reports when the D1 health query returns no rows", async () => {
		const env = {
			DB: {
				prepare: vi.fn(() => ({ first: vi.fn().mockResolvedValue(null) })),
			},
		} satisfies AppBindings["Bindings"];

		const response = await app.request("/api/health/database", undefined, env);

		expect(response.status).toBe(503);
		await expect(response.json()).resolves.toEqual({
			status: "error",
			database: "d1",
			reason: "query returned no rows",
		});
	});

	it("returns not found for unknown API routes", async () => {
		const response = await app.request("/api/unknown");

		expect(response.status).toBe(404);
	});
});
