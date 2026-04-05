import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppProviders } from "@/lib/app-providers";
import { createAppQueryClient } from "@/lib/query-client";
import { createAppRouter } from "@/router";

const mockFetch = vi.fn<(input: RequestInfo | URL) => Promise<Response>>();

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
	const router = createAppRouter(
		createMemoryHistory({
			initialEntries: [path],
		}),
	);

	await router.load();
	render(
		<AppProviders queryClient={createAppQueryClient()}>
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
		vi.unstubAllGlobals();
		mockFetch.mockReset();
	});

	it("renders the starter content on the top page", async () => {
		await renderRoute("/");
		expect(await screen.findByText("K-Drop v2")).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "Initial setup" })).toBeInTheDocument();
		expect(await screen.findByText("API status: ok")).toBeInTheDocument();
		expect(mockFetch).toHaveBeenCalledTimes(1);
	});

	it("renders the 404 page for an unknown path", async () => {
		await renderRoute("/missing");
		expect(await screen.findByRole("heading", { name: "Page not found" })).toBeInTheDocument();
		expect(screen.getByText("お探しのページは見つかりませんでした。")).toBeInTheDocument();
		expect(mockFetch).not.toHaveBeenCalled();
	});
});
