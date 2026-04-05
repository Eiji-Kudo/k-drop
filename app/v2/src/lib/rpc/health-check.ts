import { queryOptions, useQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import { apiClient } from "@/lib/rpc/client";

export const healthCheckQueryKey = ["health-check"] as const;

type HealthCheckMethod = (typeof apiClient)["api"]["health"]["$get"];

export type HealthCheckResponse = InferResponseType<HealthCheckMethod, 200>;

export async function fetchHealthCheck(): Promise<HealthCheckResponse> {
	const response = await apiClient.api.health.$get();

	if (!response.ok) {
		throw new Error(`Failed to fetch API health status: ${response.status} ${response.statusText}`);
	}

	return response.json();
}

export const healthCheckQueryOptions = queryOptions({
	queryKey: healthCheckQueryKey,
	queryFn: fetchHealthCheck,
	refetchOnWindowFocus: false,
});

export function useHealthCheckQuery() {
	return useQuery(healthCheckQueryOptions);
}
