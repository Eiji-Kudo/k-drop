import { CURRENT_USER } from "@/lib/ux/mock-state";
import { getTierProgress } from "@/lib/ux/progression";
import type { HomeMotivationViewModel } from "@/lib/ux/types";

export function createHomeMotivationViewModel(): HomeMotivationViewModel {
	const progress = getTierProgress(CURRENT_USER.currentScore);

	return {
		currentTierName: progress.currentTier.name,
		currentScore: CURRENT_USER.currentScore,
		nextTierName: progress.nextTier?.name ?? null,
		pointsToNextTier: progress.pointsToNextTier,
		nextTierProgressPercent: progress.progressPercent,
		weeklyPlayProgressLabel: "今週 2 / 3 回でボーナス",
		recentGrowthLabel: `前週比 +${CURRENT_USER.weeklyGrowthPercent}%`,
		fastestGrowingGroupLabel: "aespa 力 +80",
		primaryCtaLabel: "問題を解く",
		primaryCtaHint: "最短3分でスコアアップ",
		heroTitle: "今日もオタ力を伸ばそう",
		heroDescription: "いちばん近い目標と、今日やる理由がすぐ見えるホームにする。",
		nextTierHint: progress.pointsToNextTier && progress.pointsToNextTier <= 120 ? "今日の挑戦で届くかも" : "あと少しで次の tier 圏内",
	};
}
