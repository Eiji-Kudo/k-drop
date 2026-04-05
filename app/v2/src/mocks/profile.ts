export const MOCK_USER = {
	userName: "KPOPファン太郎",
	nickname: "@kpop_taro",
	avatarUrl: undefined,
	description: "KPOPが大好き！毎日クイズに挑戦しています。推しはBLACKPINKとaespa。ライブにも毎年参戦中！",
	fanSince: new Date("2022-03-15"),
	totalOtakuPower: 2450,
	layerName: "軽いオタク",
};

export const MOCK_BADGES = [
	{ type: "quiz_master", level: "gold", name: "Quiz Master" },
	{ type: "concert_goer", level: "silver", name: "Concert Goer" },
	{ type: "photocard_collector", level: "bronze", name: "Photocard Collector" },
	{ type: "dance_cover_star", level: "silver", name: "Dance Cover Star" },
] satisfies Array<{
	type: "quiz_master" | "concert_goer" | "photocard_collector" | "dance_cover_star";
	level: "gold" | "silver" | "bronze";
	name: string;
}>;

export const MOCK_GROUPS = [
	{ id: "1", name: "BLACKPINK", imageUrl: undefined, masteryScore: 860 },
	{ id: "2", name: "aespa", imageUrl: undefined, masteryScore: 920 },
	{ id: "3", name: "NewJeans", imageUrl: undefined, masteryScore: 520 },
	{ id: "4", name: "TWICE", imageUrl: undefined, masteryScore: 480 },
] satisfies Array<{
	id: string;
	name: string;
	imageUrl?: string;
	masteryScore: number;
}>;

export const MOCK_PROGRESS = {
	currentScore: 2450,
	percentageIncrease: 12.5,
};
