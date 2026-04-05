// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { app } from "@/lib/api/app";
import { createApiClient } from "@/lib/rpc/client";
import { fetchHealthCheck } from "@/lib/rpc/health-check";

const HEALTH_DATABASE_PATH = "http://localhost/api/health/database",
	TEST_TOKEN = "test-secret";

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

const createHealthDatabaseRequest = (token = TEST_TOKEN) => new Request(HEALTH_DATABASE_PATH, { headers: { "X-Health-Token": token } });

const requestHealthDatabase = (env: ReturnType<typeof createD1Mock>, token = TEST_TOKEN) =>
	app.request(createHealthDatabaseRequest(token), undefined, env);

const expectJsonResponse = async (response: Response, status: number, body: { status: "ok" } | { status: "error" }) => {
	expect(response.status).toBe(status);
	await expect(response.json()).resolves.toEqual(body);
};
describe("API", () => {
	afterEach(() => vi.unstubAllGlobals());

	it("returns a health check response", async () => {
		await expectJsonResponse(await app.request("/api/health"), 200, { status: "ok" });
	});

	it("allows calling the health check through the typed rpc client", async () => {
		const apiClient = createApiClient("http://localhost", {
			fetch: (...args: Parameters<typeof fetch>) => app.request(...args),
		});
		await expectJsonResponse(await apiClient.api.health.$get(), 200, { status: "ok" });
	});

	it("throws when the health check returns a non-ok response", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(() =>
				Promise.resolve(
					new Response("Internal Server Error", {
						status: 500,
						statusText: "Internal Server Error",
					}),
				),
			),
		);

		await expect(fetchHealthCheck()).rejects.toThrow("Failed to fetch API health status: 500 Internal Server Error");
	});

	it("checks the D1 binding through the health endpoint", async () => {
		const env = createD1Mock([{ ok: 1 }], { healthCheckToken: TEST_TOKEN });
		await expectJsonResponse(await requestHealthDatabase(env), 200, { status: "ok" });
		expect(env.DB.exec).toHaveBeenCalledWith("PRAGMA foreign_keys = ON");
	});

	it.each([
		["health database endpoint is called without valid token", createD1Mock([{ ok: 1 }], { healthCheckToken: "real-secret" })],
		["HEALTH_CHECK_TOKEN is not configured", createD1Mock([{ ok: 1 }])],
	])("returns 404 when %s", async (_label, env) => {
		expect((await app.request("/api/health/database", undefined, env)).status).toBe(404);
	});

	it.each([
		["the D1 health query returns no rows", []],
		["the D1 health query returns unexpected results", [{ ok: 0 }]],
	])("reports when %s", async (_label, results) => {
		const env = createD1Mock(results, { healthCheckToken: TEST_TOKEN });
		await expectJsonResponse(await requestHealthDatabase(env), 503, { status: "error" });
	});

	it("returns 503 when D1 query throws an exception", async () => {
		const env = {
			DB: {
				prepare: vi.fn(() => ({
					bind: vi.fn(() => ({
						all: vi.fn().mockRejectedValue(new Error("D1 connection failed")),
					})),
				})),
				exec: vi.fn().mockResolvedValue(undefined),
			},
			HEALTH_CHECK_TOKEN: TEST_TOKEN,
		};
		await expectJsonResponse(await requestHealthDatabase(env), 503, { status: "error" });
	});

	it("returns not found for unknown API routes", async () => {
		expect((await app.request("/api/unknown")).status).toBe(404);
	});
});
