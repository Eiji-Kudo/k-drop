import { CURRENT_USER } from "@/lib/ux/mock-state";
import { getTierProgress } from "@/lib/ux/progression";
import type { HomeMotivationViewModel } from "@/lib/ux/types";

export function createHomeMotivationViewModel(): HomeMotivationViewModel {
	const progress = getTierProgress(CURRENT_USER.currentScore);
	const topGroupName = CURRENT_USER.topGroups[0]?.groupName ?? "推し";
	const estimatedSessionsToNextTier = progress.pointsToNextTier === null ? null : Math.max(1, Math.ceil(progress.pointsToNextTier / 180));
	const heroDescription =
		progress.pointsToNextTier === null
			? "最高 tier をキープしながら、推し知識をさらに磨いていこう。"
			: estimatedSessionsToNextTier === 1
				? "あと 1 セッションで次のレベルが見えてくる。"
				: `あと ${estimatedSessionsToNextTier} セッションで次のレベルが射程圏に入る。`;
	const heroStatusLabel =
		progress.pointsToNextTier === null || progress.nextTier === null
			? "最高 tier を維持中"
			: `次は ${progress.nextTier.name} まで残り ${progress.pointsToNextTier}pt`;
	const nextGoalLabel =
		progress.pointsToNextTier === null || progress.nextTier === null
			? "最高 tier 到達中"
			: `あと ${progress.pointsToNextTier}pt で ${progress.nextTier.name}`;
	const nextGoalDescription =
		progress.pointsToNextTier === null
			? "このままスコアを積み上げてトップ帯をキープ。"
			: estimatedSessionsToNextTier === 1
				? "今日の挑戦で届くかも"
				: `最短 ${estimatedSessionsToNextTier} セッションで届くペース`;
	const nextTierHint =
		progress.pointsToNextTier === null
			? "今は最高 tier を守りながら、さらに差を広げよう。"
			: progress.pointsToNextTier <= 120
				? "今日の挑戦で届くかも"
				: estimatedSessionsToNextTier === 2
					? "あと少しで次の tier 圏内"
					: "今のペースなら今週中に見えてくる";

	return {
		currentTierName: progress.currentTier.name,
		currentScore: CURRENT_USER.currentScore,
		nextTierName: progress.nextTier?.name ?? null,
		pointsToNextTier: progress.pointsToNextTier,
		nextTierProgressPercent: progress.progressPercent,
		weeklyPlayProgressLabel: "今週 2 / 3 回プレイ",
		recentGrowthLabel: `前週比 +${CURRENT_USER.weeklyGrowthPercent}%`,
		fastestGrowingGroupLabel: `${topGroupName} 力 +80`,
		primaryCtaLabel: "問題を解く",
		primaryCtaHint: "最短3分でスコアアップ",
		primaryCtaSupportLabel: progress.pointsToNextTier === null ? "最短3分でスコアを守る" : `${progress.pointsToNextTier}pt 差を一気に縮めよう`,
		heroEyebrow: "TODAY'S DROP",
		heroTitle: "今日もオタ力を伸ばそう",
		heroDescription,
		heroStatusLabel,
		nextGoalLabel,
		nextGoalDescription,
		nextTierHint,
	};
}
