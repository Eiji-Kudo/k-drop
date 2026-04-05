import { expect, vi } from "vitest";
import { app } from "@/lib/api/app";

export const createD1Mock = (results: Record<string, unknown>[], options?: { healthCheckToken?: string }) => ({
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

export const createFailingD1Mock = (healthCheckToken: string, message: string) => ({
	DB: {
		prepare: vi.fn(() => ({
			bind: vi.fn(() => ({
				all: vi.fn().mockRejectedValue(new Error(message)),
			})),
		})),
		exec: vi.fn().mockResolvedValue(undefined),
	},
	HEALTH_CHECK_TOKEN: healthCheckToken,
});

export const requestDatabaseHealth = (env: Record<string, unknown>, token?: string) =>
	app.request(
		token ? new Request("http://localhost/api/health/database", { headers: { "X-Health-Token": token } }) : "/api/health/database",
		undefined,
		env,
	);

export const expectStatusJson = async (response: Response, status: number, body: Record<string, string>) => {
	expect(response.status).toBe(status);
	await expect(response.json()).resolves.toEqual(body);
};

export const appFetch = (...args: Parameters<typeof fetch>) => app.request(...args);
