import { describe, expect, it } from "vitest";
import type { QuizResultData } from "@/components/quiz-result/types";
import {
	createHomeMotivationViewModel,
	createProfileGrowthViewModel,
	createQuizResultMotivationViewModel,
	createRankingMotivationViewModel,
} from "@/lib/ux";

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
		const resultData: QuizResultData = {
			totalScore: 320,
			results: [
				{ questionId: "q1", prompt: "q1", isCorrect: true, userAnswer: "a", correctAnswer: "a", explanation: "x" },
				{ questionId: "q2", prompt: "q2", isCorrect: true, userAnswer: "a", correctAnswer: "a", explanation: "x" },
				{ questionId: "q3", prompt: "q3", isCorrect: true, userAnswer: "a", correctAnswer: "a", explanation: "x" },
				{ questionId: "q4", prompt: "q4", isCorrect: true, userAnswer: "a", correctAnswer: "a", explanation: "x" },
				{ questionId: "q5", prompt: "q5", isCorrect: false, userAnswer: "a", correctAnswer: "b", explanation: "x" },
			],
		};

		const viewModel = createQuizResultMotivationViewModel(resultData, "BLACKPINK");

		expect(viewModel.correctCount).toBe(4);
		expect(viewModel.gainedScore).toBe(320);
		expect(viewModel.resultHeadline).toBe("かなり仕上がってきた");
		expect(viewModel.growthLabel).toBe("BLACKPINK 力アップ");
		expect(viewModel.primaryRetryLabel).toBe("もう一度解く");
	});

	it("builds ranking data with top three and around-you blocks", () => {
		const viewModel = createRankingMotivationViewModel("総合");

		expect(viewModel.topThree).toHaveLength(3);
		expect(viewModel.aroundYou).not.toBeNull();
		expect(viewModel.aroundYou?.neighbors.some((entry) => entry.isSelf)).toBe(true);
		expect(viewModel.fullList.some((entry) => entry.isSelf)).toBe(true);
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
