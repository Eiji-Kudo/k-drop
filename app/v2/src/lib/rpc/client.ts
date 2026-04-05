import { hc } from "hono/client";
import type { AppType } from "@/lib/api/app";

type CreateApiClientOptions = Parameters<typeof hc>[1];

export function createApiClient(baseUrl = "/", options?: CreateApiClientOptions) {
	return hc<AppType>(baseUrl, options);
}

export const apiClient = createApiClient();
