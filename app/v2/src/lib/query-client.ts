import { QueryClient } from "@tanstack/react-query";

export function createAppQueryClient() {
	return new QueryClient();
}

export const appQueryClient = createAppQueryClient();
