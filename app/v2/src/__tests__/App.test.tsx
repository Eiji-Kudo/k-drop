import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppProviders } from "@/lib/app-providers";
import { createAppRouter } from "@/router";

const mockFetch = vi.fn<typeof fetch>();

function getRequestUrl(input: RequestInfo | URL) {
	if (typeof input === "string") {
		return input;
	}

	if (input instanceof URL) {
		return input.toString();
	}

	return input.url;
}

async function renderRoute(path: string) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	const router = createAppRouter(
		createMemoryHistory({
			initialEntries: [path],
		}),
	);

	await router.load();
	render(
		<AppProviders queryClient={queryClient}>
			<RouterProvider router={router} />
		</AppProviders>,
	);
}

describe("App routes", () => {
	beforeEach(() => {
		mockFetch.mockImplementation((input) => {
			const url = getRequestUrl(input);

			if (url.endsWith("/api/health")) {
				return Promise.resolve(
					new Response(JSON.stringify({ status: "ok" }), {
						status: 200,
						headers: {
							"Content-Type": "application/json",
						},
					}),
				);
			}

			return Promise.resolve(new Response("Not Found", { status: 404 }));
		});
		vi.stubGlobal("fetch", mockFetch);
	});

	afterEach(() => {
		cleanup();
		vi.unstubAllGlobals();
		mockFetch.mockReset();
	});

	it("renders the starter content on the top page", async () => {
		await renderRoute("/");
		expect(await screen.findByText("K-Drop v2")).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "Initial setup" })).toBeInTheDocument();
		expect(document.querySelector("[data-theme='kdrop']")).toBeInTheDocument();
		expect(await screen.findByText("API status: ok")).toBeInTheDocument();
		expect(mockFetch).toHaveBeenCalledTimes(1);
	});

	it("shows loading state while the health check is pending", async () => {
		mockFetch.mockImplementation(() => new Promise(() => {}));
		await renderRoute("/");
		expect(screen.getByText("Checking API...")).toBeInTheDocument();
	});

	it("shows unavailable status when the health check fails", async () => {
		mockFetch.mockRejectedValue(new TypeError("Network error"));
		await renderRoute("/");
		expect(await screen.findByText("API status: unavailable", {}, { timeout: 3000 })).toBeInTheDocument();
	});

	it("renders the 404 page for an unknown path", async () => {
		await renderRoute("/missing");
		expect(await screen.findByRole("heading", { name: "Page not found" })).toBeInTheDocument();
		expect(screen.getByText("お探しのページは見つかりませんでした。")).toBeInTheDocument();
		expect(mockFetch).not.toHaveBeenCalled();
	});
});
