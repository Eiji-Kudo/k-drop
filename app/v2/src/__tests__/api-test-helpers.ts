import { vi } from "vitest";

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
