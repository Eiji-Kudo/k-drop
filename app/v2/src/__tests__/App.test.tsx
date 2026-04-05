import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppProviders } from "@/lib/app-providers";
import { createAppRouter } from "@/router";

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
		vi.stubGlobal(
			"fetch",
			vi.fn<typeof fetch>(() => Promise.resolve(new Response("Not Found", { status: 404 }))),
		);
	});

	afterEach(() => {
		cleanup();
		vi.unstubAllGlobals();
	});

	it("renders the home page", async () => {
		await renderRoute("/");
		expect(await screen.findByRole("heading", { name: "ホーム" })).toBeInTheDocument();
		expect(screen.getByRole("navigation", { name: "メインナビゲーション" })).toBeInTheDocument();
	});

	it("renders the bottom tab bar with four tabs", async () => {
		await renderRoute("/");
		const nav = screen.getByRole("navigation", { name: "メインナビゲーション" });
		expect(nav).toBeInTheDocument();
		expect(within(nav).getByText("ホーム")).toBeInTheDocument();
		expect(within(nav).getByText("クイズ")).toBeInTheDocument();
		expect(within(nav).getByText("ランキング")).toBeInTheDocument();
		expect(within(nav).getByText("プロフィール")).toBeInTheDocument();
	});

	it("hides the tab bar on quiz session page", async () => {
		await renderRoute("/quiz/abc123");
		expect(await screen.findByRole("heading", { name: "クイズ" })).toBeInTheDocument();
		expect(screen.queryByRole("navigation", { name: "メインナビゲーション" })).not.toBeInTheDocument();
	});

	it("renders the 404 page for an unknown path", async () => {
		await renderRoute("/missing");
		expect(await screen.findByRole("heading", { name: "Page not found" })).toBeInTheDocument();
		expect(screen.getByText("お探しのページは見つかりませんでした。")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "トップページに戻る" })).toBeInTheDocument();
	});
});
