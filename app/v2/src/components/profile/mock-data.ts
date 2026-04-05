import type { Badge, MockGroup } from "./types";

export const MOCK_USER = {
	userName: "KPOPファン太郎",
	nickname: "@kpop_taro",
	avatarUrl: undefined,
	description: "KPOPが大好き！毎日クイズに挑戦しています。推しはBLACKPINKとaespa。ライブにも毎年参戦中！",
	fanSince: new Date("2022-03-15"),
	totalOtakuPower: 2450,
	layerName: "軽いオタク",
};

export const MOCK_BADGES: Badge[] = [
	{ type: "quiz_master", level: "gold", name: "Quiz Master" },
	{ type: "concert_goer", level: "silver", name: "Concert Goer" },
	{ type: "photocard_collector", level: "bronze", name: "Photocard Collector" },
	{ type: "dance_cover_star", level: "silver", name: "Dance Cover Star" },
];

export const MOCK_GROUPS: MockGroup[] = [
	{ id: "1", name: "BLACKPINK", imageUrl: undefined },
	{ id: "2", name: "aespa", imageUrl: undefined },
	{ id: "3", name: "NewJeans", imageUrl: undefined },
	{ id: "4", name: "TWICE", imageUrl: undefined },
];

export const MOCK_PROGRESS = {
	currentScore: 2450,
	percentageIncrease: 12.5,
};
