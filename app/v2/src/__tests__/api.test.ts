// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { app } from "@/lib/api/app";
import { createApiClient } from "@/lib/rpc/client";
import { fetchHealthCheck } from "@/lib/rpc/health-check";

describe("API", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("returns a health check response", async () => {
		const response = await app.request("/api/health");

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			status: "ok",
		});
	});

	it("allows calling the health check through the typed rpc client", async () => {
		const apiClient = createApiClient("http://localhost", {
			fetch: (...args: Parameters<typeof fetch>) => app.request(...args),
		});
		const response = await apiClient.api.health.$get();

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			status: "ok",
		});
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

	it("returns not found for unknown API routes", async () => {
		const response = await app.request("/api/unknown");

		expect(response.status).toBe(404);
	});
});
