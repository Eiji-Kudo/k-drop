import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { appQueryClient } from "@/lib/query-client";

type AppProvidersProps = PropsWithChildren<{
	queryClient?: typeof appQueryClient;
}>;

export function AppProviders({ children, queryClient = appQueryClient }: AppProvidersProps) {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
