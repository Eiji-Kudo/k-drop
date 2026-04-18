// @vitest-environment happy-dom
import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppProviders } from "@/lib/app-providers";
import { createAppRouter } from "@/router";
import type { FileRoutesById } from "@/routeTree.gen";

type LeafRouteId = Exclude<keyof FileRoutesById, "__root__">;

const ROUTE_ID = {
	HOME: "/(tabs)/",
	PROFILE: "/(tabs)/profile/",
	RANKING: "/(tabs)/ranking/",
	QUIZ_CREATE: "/(tabs)/quiz/create",
	QUIZ_QUESTION: "/(tabs)/quiz/question",
	QUIZ_RESULT: "/(tabs)/quiz/result",
	QUIZ_SESSION: "/(tabs)/quiz/$sessionId",
} as const satisfies Record<string, LeafRouteId>;

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

	return router;
}

describe("App routes", () => {
	let alertMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.stubGlobal(
			"fetch",
			vi.fn<typeof fetch>(() => Promise.resolve(new Response("Not Found", { status: 404 }))),
		);
		alertMock = vi.fn();
		vi.stubGlobal("alert", alertMock);
	});

	afterEach(() => {
		cleanup();
		vi.unstubAllGlobals();
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
		const router = await renderRoute("/");
		const nav = screen.getByRole("navigation", { name: "メインナビゲーション" });
		expect(nav).toBeInTheDocument();
		expect(within(nav).getByText("ホーム")).toBeInTheDocument();
		expect(within(nav).getByText("クイズ")).toBeInTheDocument();
		expect(within(nav).getByText("ランキング")).toBeInTheDocument();
		expect(within(nav).getByText("プロフィール")).toBeInTheDocument();
		expect(router.state.matches.map((match) => match.routeId)).toContain(ROUTE_ID.HOME);
	});

	it("hides the tab bar on quiz session page", async () => {
		const router = await renderRoute("/quiz/abc123?groupId=1");
		expect(await screen.findByRole("heading", { name: "問題を解く" })).toBeInTheDocument();
		expect(screen.queryByRole("navigation", { name: "メインナビゲーション" })).not.toBeInTheDocument();
		expect(router.state.matches.map((match) => match.routeId)).toContain(ROUTE_ID.QUIZ_SESSION);
	});

	it("renders the profile route through the tabs wrapper", async () => {
		const router = await renderRoute("/profile");
		expect(await screen.findByRole("heading", { name: "KPOPファン太郎" })).toBeInTheDocument();
		expect(screen.getByRole("navigation", { name: "メインナビゲーション" })).toBeInTheDocument();
		expect(router.state.matches.map((match) => match.routeId)).toContain(ROUTE_ID.PROFILE);
	});

	it("renders the quiz create route through the tabs wrapper", async () => {
		const router = await renderRoute("/quiz/create");
		expect(await screen.findByRole("heading", { name: "クイズ作成" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "作成する" })).toBeInTheDocument();
		expect(screen.getByRole("navigation", { name: "メインナビゲーション" })).toBeInTheDocument();
		expect(router.state.matches.map((match) => match.routeId)).toContain(ROUTE_ID.QUIZ_CREATE);
	});

	it("navigates back to the home route after creating a quiz", async () => {
		const router = await renderRoute("/quiz/create");

		fireEvent.change(screen.getByLabelText("対象グループ"), {
			target: { value: "01J0000000000000000000001" },
		});
		fireEvent.change(screen.getByLabelText("難易度"), {
			target: { value: "easy" },
		});
		fireEvent.change(screen.getByLabelText("問題文"), {
			target: { value: "TWICEのデビュー曲は？" },
		});
		fireEvent.change(screen.getByPlaceholderText("選択肢 1 を入力"), {
			target: { value: "Like Ooh-Ahh" },
		});
		fireEvent.change(screen.getByPlaceholderText("選択肢 2 を入力"), {
			target: { value: "CHEER UP" },
		});
		fireEvent.change(screen.getByPlaceholderText("選択肢 3 を入力"), {
			target: { value: "TT" },
		});
		fireEvent.change(screen.getByPlaceholderText("選択肢 4 を入力"), {
			target: { value: "SIGNAL" },
		});
		fireEvent.click(screen.getByRole("radio", { name: "選択肢 1" }));
		fireEvent.change(screen.getByLabelText("解説"), {
			target: { value: "デビュー曲は Like Ooh-Ahh。" },
		});
		fireEvent.click(screen.getByRole("button", { name: "作成する" }));

		await waitFor(() => expect(router.state.location.pathname).toBe("/"));
		expect(alertMock).toHaveBeenCalledWith("クイズを作成しました！");
	});

	it("hides the tab bar on the direct quiz question route", async () => {
		const router = await renderRoute("/quiz/question");
		expect(await screen.findByRole("heading", { name: "問題を解く" })).toBeInTheDocument();
		expect(screen.queryByRole("navigation", { name: "メインナビゲーション" })).not.toBeInTheDocument();
		expect(router.state.matches.map((match) => match.routeId)).toContain(ROUTE_ID.QUIZ_QUESTION);
	});

	it("navigates from group selection through the quiz flow to the result screen", async () => {
		const router = await renderRoute("/quiz");

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
		expect(router.state.matches.map((match) => match.routeId)).toContain(ROUTE_ID.QUIZ_RESULT);
	}, 10000);

	it("renders the 404 page for an unknown path", async () => {
		await renderRoute("/missing");
		expect(await screen.findByRole("heading", { name: "ページが見つかりません" })).toBeInTheDocument();
		expect(screen.getByText("リンク先が変わったか、まだ準備中のページです。ホームからもう一度探してください。")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "トップページに戻る" })).toBeInTheDocument();
	});

	it("renders the total ranking by default on the ranking page", async () => {
		const router = await renderRoute("/ranking");
		expect(await screen.findByRole("button", { name: "総合" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "TWICE" })).toBeInTheDocument();
		expect(screen.getByText("momo_love")).toBeInTheDocument();
		expect(screen.getByText("9850")).toBeInTheDocument();
		expect(screen.getByRole("navigation", { name: "メインナビゲーション" })).toBeInTheDocument();
		expect(router.state.matches.map((match) => match.routeId)).toContain(ROUTE_ID.RANKING);
	});

	it("switches to the selected group ranking tab", async () => {
		await renderRoute("/ranking");
		fireEvent.click(await screen.findByRole("button", { name: "BLACKPINK" }));
		expect(screen.getByText("blink_no1")).toBeInTheDocument();
		expect(screen.getByText("4850")).toBeInTheDocument();
		expect(screen.queryByText("9850")).not.toBeInTheDocument();
	});
});
