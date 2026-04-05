// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { app } from "@/lib/api/app";

const createD1Mock = (results: Record<string, unknown>[], options?: { healthCheckToken?: string }) => ({
	DB: {
		prepare: vi.fn(() => ({
			bind: vi.fn(() => ({
				all: vi.fn().mockResolvedValue({ results }),
			})),
		})),
		exec: vi.fn().mockResolvedValue(undefined),
	},
	HEALTH_CHECK_TOKEN: options?.healthCheckToken,
});

describe("API", () => {
	it("returns a health check response", async () => {
		const response = await app.request("/api/health");

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			status: "ok",
		});
	});

	it("checks the D1 binding through the health endpoint", async () => {
		const token = "test-secret";
		const env = createD1Mock([{ ok: 1 }], { healthCheckToken: token });
		const req = new Request("http://localhost/api/health/database", { headers: { "X-Health-Token": token } });

		const response = await app.request(req, undefined, env);

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			status: "ok",
		});
		expect(env.DB.prepare).toHaveBeenCalledWith("SELECT 1 AS ok");
		expect(env.DB.exec).toHaveBeenCalledWith("PRAGMA foreign_keys = ON");
	});

	it("returns 404 when health database endpoint is called without valid token", async () => {
		const env = createD1Mock([{ ok: 1 }], { healthCheckToken: "real-secret" });

		const response = await app.request("/api/health/database", undefined, env);

		expect(response.status).toBe(404);
	});

	it("reports when the D1 health query returns no rows", async () => {
		const token = "test-secret";
		const env = createD1Mock([], { healthCheckToken: token });
		const req = new Request("http://localhost/api/health/database", { headers: { "X-Health-Token": token } });

		const response = await app.request(req, undefined, env);

		expect(response.status).toBe(503);
		await expect(response.json()).resolves.toEqual({
			status: "error",
		});
	});

	it("reports unexpected D1 health query results", async () => {
		const token = "test-secret";
		const env = createD1Mock([{ ok: 0 }], { healthCheckToken: token });
		const req = new Request("http://localhost/api/health/database", { headers: { "X-Health-Token": token } });

		const response = await app.request(req, undefined, env);

		expect(response.status).toBe(503);
		await expect(response.json()).resolves.toEqual({
			status: "error",
		});
	});

	it("returns 503 when D1 query throws an exception", async () => {
		const token = "test-secret";
		const env = {
			DB: {
				prepare: vi.fn(() => ({
					bind: vi.fn(() => ({
						all: vi.fn().mockRejectedValue(new Error("D1 connection failed")),
					})),
				})),
				exec: vi.fn().mockResolvedValue(undefined),
			},
			HEALTH_CHECK_TOKEN: token,
		};
		const req = new Request("http://localhost/api/health/database", { headers: { "X-Health-Token": token } });

		const response = await app.request(req, undefined, env);

		expect(response.status).toBe(503);
		await expect(response.json()).resolves.toEqual({
			status: "error",
		});
	});

	it("returns not found for unknown API routes", async () => {
		const response = await app.request("/api/unknown");

		expect(response.status).toBe(404);
	});
});
