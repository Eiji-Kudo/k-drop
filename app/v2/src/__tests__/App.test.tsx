import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
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

	it("renders the home screen with welcome header and bento grid", async () => {
		await renderRoute("/");
		expect(screen.getByText("オタ力バトルしよう！")).toBeInTheDocument();
		expect(screen.getByText("軽いオタク")).toBeInTheDocument();
		expect(screen.getByText("問題を解く")).toBeInTheDocument();
		expect(screen.getByText("問題を作成")).toBeInTheDocument();
		expect(screen.getAllByText("ランキング").length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText("プロフィール").length).toBeGreaterThanOrEqual(1);
	});

	it("renders star rating for user level", async () => {
		await renderRoute("/");
		expect(screen.getByText("★★☆☆☆")).toBeInTheDocument();
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

	it("renders the total ranking by default on the ranking page", async () => {
		await renderRoute("/ranking");
		expect(await screen.findByRole("button", { name: "Total" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "TWICE" })).toBeInTheDocument();
		expect(screen.getByText("momo_love")).toBeInTheDocument();
		expect(screen.getByText("9850")).toBeInTheDocument();
	});

	it("switches to the selected group ranking tab", async () => {
		await renderRoute("/ranking");
		fireEvent.click(await screen.findByRole("button", { name: "BLACKPINK" }));
		expect(screen.getByText("blink_no1")).toBeInTheDocument();
		expect(screen.getByText("4850")).toBeInTheDocument();
		expect(screen.queryByText("9850")).not.toBeInTheDocument();
	});
});
