import type { CurrentUserProfile, ScoreTier } from "@/lib/ux/types";
import { MOCK_BADGES, MOCK_GROUPS, MOCK_PROGRESS, MOCK_USER } from "@/mocks/profile";

const GROUP_MASTERY_SCORES: Record<string, number> = {
	"1": 520,
	"2": 860,
	"3": 920,
	"4": 480,
};

export const SCORE_TIERS: ReadonlyArray<ScoreTier> = [
	{ name: "ルーキー", minScore: 0 },
	{ name: "ビギナー", minScore: 600 },
	{ name: "軽いオタク", minScore: 1400 },
	{ name: "インターミディエイト", minScore: 2800 },
	{ name: "アドバンス", minScore: 4300 },
	{ name: "エキスパート", minScore: 6500 },
	{ name: "マスター", minScore: 9000 },
] as const;

export const CURRENT_USER: CurrentUserProfile = {
	displayName: MOCK_USER.userName,
	rankingName: "kpop_taro",
	nickname: MOCK_USER.nickname,
	currentScore: MOCK_PROGRESS.currentScore,
	fanSince: MOCK_USER.fanSince ?? new Date(),
	weeklyGrowthPercent: MOCK_PROGRESS.percentageIncrease ?? 0,
	description: MOCK_USER.description,
	badges: MOCK_BADGES,
	topGroups: MOCK_GROUPS.map((group) => ({
		groupId: group.id,
		groupName: group.name,
		score: GROUP_MASTERY_SCORES[group.id] ?? 480,
	})).sort((left, right) => right.score - left.score),
};
