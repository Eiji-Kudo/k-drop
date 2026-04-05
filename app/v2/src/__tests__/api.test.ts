// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { app } from "@/lib/api/app";
import { createApiClient } from "@/lib/rpc/client";
import { fetchHealthCheck } from "@/lib/rpc/health-check";
import { appFetch, createD1Mock, createFailingD1Mock, expectStatusJson, requestDatabaseHealth } from "./api-test-helpers";

describe("API", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("returns a health check response", async () => {
		const response = await app.request("/api/health");
		await expectStatusJson(response, 200, { status: "ok" });
	});

	it("allows calling the health check through the typed rpc client", async () => {
		const apiClient = createApiClient("http://localhost", { fetch: appFetch });
		const response = await apiClient.api.health.$get();
		await expectStatusJson(response, 200, { status: "ok" });
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
		const token = "test-secret";
		const env = createD1Mock([{ ok: 1 }], { healthCheckToken: token });
		const response = await requestDatabaseHealth(env, token);
		await expectStatusJson(response, 200, { status: "ok" });
		expect(env.DB.exec).toHaveBeenCalledWith("PRAGMA foreign_keys = ON");
	});

	it("returns 404 when health database endpoint is called without valid token", async () => {
		const env = createD1Mock([{ ok: 1 }], { healthCheckToken: "real-secret" });
		const response = await requestDatabaseHealth(env);
		expect(response.status).toBe(404);
	});

	it("returns 404 when HEALTH_CHECK_TOKEN is not configured", async () => {
		const env = createD1Mock([{ ok: 1 }]);
		const response = await requestDatabaseHealth(env);
		expect(response.status).toBe(404);
	});

	it("reports when the D1 health query returns no rows", async () => {
		const token = "test-secret";
		const env = createD1Mock([], { healthCheckToken: token });
		const response = await requestDatabaseHealth(env, token);
		await expectStatusJson(response, 503, { status: "error" });
	});

	it("reports unexpected D1 health query results", async () => {
		const token = "test-secret";
		const env = createD1Mock([{ ok: 0 }], { healthCheckToken: token });
		const response = await requestDatabaseHealth(env, token);
		await expectStatusJson(response, 503, { status: "error" });
	});

	it("returns 503 when D1 query throws an exception", async () => {
		const token = "test-secret";
		const env = createFailingD1Mock(token, "D1 connection failed");
		const response = await requestDatabaseHealth(env, token);
		await expectStatusJson(response, 503, { status: "error" });
	});

	it("returns not found for unknown API routes", async () => {
		const response = await app.request("/api/unknown");

		expect(response.status).toBe(404);
	});
});
