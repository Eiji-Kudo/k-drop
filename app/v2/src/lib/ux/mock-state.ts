import type { CurrentUserProfile, ScoreTier } from "@/lib/ux/types";

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
	displayName: "KPOPファン太郎",
	rankingName: "kpop_taro",
	nickname: "@kpop_taro",
	currentScore: 2450,
	fanSince: new Date("2022-03-15"),
	weeklyGrowthPercent: 12.5,
	description: "BLACKPINK と aespa を中心に、短時間で回せるクイズを毎日1本ずつ進めているファン。",
	badges: [
		{ type: "quiz_master", level: "gold", name: "Quiz Master" },
		{ type: "concert_goer", level: "silver", name: "Concert Goer" },
		{ type: "photocard_collector", level: "bronze", name: "Photocard Collector" },
		{ type: "dance_cover_star", level: "silver", name: "Dance Cover Star" },
	],
	topGroups: [
		{ groupName: "aespa", score: 920 },
		{ groupName: "BLACKPINK", score: 860 },
		{ groupName: "LE SSERAFIM", score: 640 },
		{ groupName: "IVE", score: 520 },
	],
};
