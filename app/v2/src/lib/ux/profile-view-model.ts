import { CURRENT_USER } from "@/lib/ux/mock-state";
import { formatFanSince, getMasteryTier, getTierProgress } from "@/lib/ux/progression";
import type { ProfileGrowthViewModel } from "@/lib/ux/types";

export function createProfileGrowthViewModel(): ProfileGrowthViewModel {
	const progress = getTierProgress(CURRENT_USER.currentScore);

	// TODO: 実データ接続時は badge progress を achievement 系テーブルで置き換える。
	return {
		userName: CURRENT_USER.displayName,
		nickname: CURRENT_USER.nickname,
		currentTierName: progress.currentTier.name,
		currentScore: CURRENT_USER.currentScore,
		nextTierName: progress.nextTier?.name ?? null,
		pointsToNextTier: progress.pointsToNextTier,
		fanSinceLabel: formatFanSince(CURRENT_USER.fanSince),
		weeklyGrowthLabel: `今週 +${CURRENT_USER.weeklyGrowthPercent}%`,
		badges: CURRENT_USER.badges,
		nextBadgeHint: "あと1回の全問正解で Quiz Master が強化",
		topGroups: CURRENT_USER.topGroups.map((group) => ({
			groupName: group.groupName,
			scoreLabel: `${group.score} pt`,
			tierName: getMasteryTier(group.score),
		})),
		description: CURRENT_USER.description,
		recentGrowthHint: progress.pointsToNextTier ? `あと ${progress.pointsToNextTier}pt で ${progress.nextTier?.name}` : "最高 tier をキープ中",
	};
}
