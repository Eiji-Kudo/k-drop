import { describe, expect, it } from "vitest";
import {
	createHomeMotivationViewModel,
	createProfileGrowthViewModel,
	createQuizResultMotivationViewModel,
	createRankingMotivationViewModel,
} from "@/lib/ux";
import type { QuizResultMotivationInput, RankingEntry } from "@/lib/ux/types";

describe("motivation view models", () => {
	it("builds home motivation data from the shared score tiers", () => {
		const viewModel = createHomeMotivationViewModel();

		expect(viewModel.currentTierName).toBe("軽いオタク");
		expect(viewModel.currentScore).toBe(2450);
		expect(viewModel.nextTierName).toBe("インターミディエイト");
		expect(viewModel.pointsToNextTier).toBe(350);
		expect(viewModel.nextTierProgressPercent).toBe(75);
		expect(viewModel.primaryCtaLabel).toBe("問題を解く");
	});

	it("builds quiz result motivation data with a positive retry loop", () => {
		const resultData: QuizResultMotivationInput = {
			totalScore: 320,
			results: [{ isCorrect: true }, { isCorrect: true }, { isCorrect: true }, { isCorrect: true }, { isCorrect: false }],
		};

		const viewModel = createQuizResultMotivationViewModel(resultData, "BLACKPINK");

		expect(viewModel.correctCount).toBe(4);
		expect(viewModel.gainedScore).toBe(320);
		expect(viewModel.resultHeadline).toBe("かなり仕上がってきた");
		expect(viewModel.growthLabel).toBe("BLACKPINK 力アップ");
		expect(viewModel.primaryRetryLabel).toBe("もう一度解く");
	});

	it("builds ranking data with top three and around-you blocks", () => {
		const entries: ReadonlyArray<RankingEntry> = [
			{ rank: 1, userName: "momo_love", layerName: "マスター", score: 4980 },
			{ rank: 2, userName: "kpop_queen", layerName: "マスター", score: 4720 },
			{ rank: 3, userName: "twice_fan99", layerName: "エキスパート", score: 4480 },
			{ rank: 4, userName: "bias_wrecker", layerName: "アドバンス", score: 2510 },
			{ rank: 5, userName: "mv_reactor", layerName: "ビギナー", score: 2380 },
		];
		const viewModel = createRankingMotivationViewModel({
			scopeLabel: "総合",
			entries,
		});

		expect(viewModel.topThree).toHaveLength(3);
		expect(viewModel.aroundYou).not.toBeNull();
		expect(viewModel.aroundYou?.neighbors.some((entry) => entry.isSelf)).toBe(true);
		expect(viewModel.fullList.some((entry) => entry.isSelf)).toBe(true);
		expect(viewModel.aroundYou?.pointsToNextRank).toBe(60);
	});

	it("builds profile growth data with next goal and badge hints", () => {
		const viewModel = createProfileGrowthViewModel();

		expect(viewModel.userName).toBe("KPOPファン太郎");
		expect(viewModel.pointsToNextTier).toBe(350);
		expect(viewModel.weeklyGrowthLabel).toBe("今週 +12.5%");
		expect(viewModel.nextBadgeHint).toContain("Quiz Master");
		expect(viewModel.topGroups[0]?.tierName).toBe("コア");
	});
});
