// @vitest-environment happy-dom
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
		vi.useRealTimers();
	});

	it("renders the home screen as a motivation hub", async () => {
		await renderRoute("/");
		expect(screen.getByText("今日もオタ力を伸ばそう")).toBeInTheDocument();
		expect(screen.getAllByText("軽いオタク").length).toBeGreaterThanOrEqual(1);
		expect(screen.getByText("次のレベルまで")).toBeInTheDocument();
		expect(screen.getByText("あと 350pt で インターミディエイト")).toBeInTheDocument();
		expect(screen.getByText("問題を解く")).toBeInTheDocument();
		expect(screen.getByText("問題を作成")).toBeInTheDocument();
		expect(screen.getAllByText("ランキング").length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText("プロフィール").length).toBeGreaterThanOrEqual(1);
	});

	it("renders momentum cues on the home screen", async () => {
		await renderRoute("/");
		expect(screen.getByText("今週 2 / 3 回プレイ")).toBeInTheDocument();
		expect(screen.getByText("前週比 +12.5%")).toBeInTheDocument();
		expect(screen.getByText("aespa 力 +80")).toBeInTheDocument();
		expect(screen.getByText("350pt 差を一気に縮めよう")).toBeInTheDocument();
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
		await renderRoute("/quiz/abc123?groupId=1");
		expect(await screen.findByRole("heading", { name: "問題を解く" })).toBeInTheDocument();
		expect(screen.queryByRole("navigation", { name: "メインナビゲーション" })).not.toBeInTheDocument();
	});

	it("navigates from group selection through the quiz flow to the result screen", async () => {
		await renderRoute("/quiz");

		fireEvent.click(screen.getByRole("button", { name: "BLACKPINK" }));
		fireEvent.click(screen.getByRole("button", { name: "問題へ進む" }));

		expect(await screen.findByRole("heading", { name: "問題を解く" })).toBeInTheDocument();

		const answers = ["3. ナヨン", "2. Like Ooh-Ahh", "3. RM", "2. æ", "4. STARSHIPエンターテインメント"];

		for (const answer of answers) {
			fireEvent.click(screen.getByRole("button", { name: answer }));
			fireEvent.click(await screen.findByRole("button", { name: "次へ" }));
		}

		expect(await screen.findByRole("heading", { name: "クイズ結果" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "グループ一覧に戻る" })).toBeInTheDocument();
	}, 10000);

	it("renders the 404 page for an unknown path", async () => {
		await renderRoute("/missing");
		expect(await screen.findByRole("heading", { name: "ページが見つかりません" })).toBeInTheDocument();
		expect(screen.getByText("リンク先が変わったか、まだ準備中のページです。ホームからもう一度探してください。")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "トップページに戻る" })).toBeInTheDocument();
	});

	it("renders the total ranking by default on the ranking page", async () => {
		await renderRoute("/ranking");
		expect(await screen.findByRole("button", { name: "総合" })).toBeInTheDocument();
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
