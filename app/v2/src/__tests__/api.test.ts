// @vitest-environment node
import { describe, expect, it } from "vitest";
import { app } from "@/lib/api/app";
import { createApiClient } from "@/lib/rpc/client";

describe("API", () => {
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

	it("returns not found for unknown API routes", async () => {
		const response = await app.request("/api/unknown");

		expect(response.status).toBe(404);
	});
});
