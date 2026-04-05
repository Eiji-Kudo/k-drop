import { queryOptions, useQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import { apiClient } from "@/lib/rpc/client";

export const healthCheckQueryKey = ["health-check"] as const;

type HealthCheckMethod = (typeof apiClient)["api"]["health"]["$get"];

export type HealthCheckResponse = InferResponseType<HealthCheckMethod, 200>;

export function createFetchHealthCheck(client: typeof apiClient = apiClient) {
	return async function fetchHealthCheck(): Promise<HealthCheckResponse> {
		const response = await client.api.health.$get();

		if (!response.ok) {
			throw new Error(`Failed to fetch API health status: ${response.status} ${response.statusText}`);
		}

		return response.json();
	};
}

export const fetchHealthCheck = createFetchHealthCheck();

export function createHealthCheckQueryOptions(client: typeof apiClient = apiClient) {
	return queryOptions({
		queryKey: healthCheckQueryKey,
		queryFn: createFetchHealthCheck(client),
	});
}

export const healthCheckQueryOptions = createHealthCheckQueryOptions();

export function useHealthCheckQuery() {
	return useQuery(healthCheckQueryOptions);
}
