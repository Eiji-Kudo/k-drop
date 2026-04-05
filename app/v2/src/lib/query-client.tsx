import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

export function createAppQueryClient() {
	return new QueryClient();
}

const defaultQueryClient = createAppQueryClient();

type AppProvidersProps = PropsWithChildren<{
	queryClient?: QueryClient;
}>;

export function AppProviders({ children, queryClient = defaultQueryClient }: AppProvidersProps) {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
