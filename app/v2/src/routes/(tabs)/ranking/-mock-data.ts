import { GROUP_RANKINGS_1 } from "./-mock-group-rankings-1";
import { GROUP_RANKINGS_2 } from "./-mock-group-rankings-2";
import type { GroupRankingEntry, IdolGroup, TotalRankingEntry } from "./-types";

export type { GroupRankingEntry, IdolGroup, TotalRankingEntry } from "./-types";

export const IDOL_GROUPS: ReadonlyArray<IdolGroup> = [
	{ id: "1", name: "TWICE" },
	{ id: "2", name: "BLACKPINK" },
	{ id: "3", name: "aespa" },
	{ id: "4", name: "IVE" },
	{ id: "5", name: "LE SSERAFIM" },
	{ id: "6", name: "NewJeans" },
	{ id: "7", name: "(G)I-DLE" },
	{ id: "8", name: "ITZY" },
];

export const TOTAL_RANKINGS: ReadonlyArray<TotalRankingEntry> = [
	{ rank: 1, userName: "momo_love", layerName: "マスター", score: 9850 },
	{ rank: 2, userName: "kpop_queen", layerName: "マスター", score: 9720 },
	{ rank: 3, userName: "twice_fan99", layerName: "エキスパート", score: 9510 },
	{ rank: 4, userName: "hallyu_star", layerName: "エキスパート", score: 9340 },
	{ rank: 5, userName: "idol_mania", layerName: "エキスパート", score: 9100 },
	{ rank: 6, userName: "seoul_vibes", layerName: "アドバンス", score: 8870 },
	{ rank: 7, userName: "kpop_nerd", layerName: "アドバンス", score: 8650 },
	{ rank: 8, userName: "bias_wrecker", layerName: "アドバンス", score: 8420 },
	{ rank: 9, userName: "stan_forever", layerName: "アドバンス", score: 8200 },
	{ rank: 10, userName: "dance_cover", layerName: "インターミディエイト", score: 7980 },
	{ rank: 11, userName: "mv_reactor", layerName: "インターミディエイト", score: 7750 },
	{ rank: 12, userName: "lightstick_army", layerName: "インターミディエイト", score: 7520 },
	{ rank: 13, userName: "fancam_lover", layerName: "インターミディエイト", score: 7300 },
	{ rank: 14, userName: "vocal_stan", layerName: "ビギナー", score: 7080 },
	{ rank: 15, userName: "comeback_alert", layerName: "ビギナー", score: 6850 },
	{ rank: 16, userName: "photo_card", layerName: "ビギナー", score: 6620 },
	{ rank: 17, userName: "concert_goer", layerName: "ビギナー", score: 6400 },
	{ rank: 18, userName: "merch_collector", layerName: "ルーキー", score: 6180 },
	{ rank: 19, userName: "unboxing_daily", layerName: "ルーキー", score: 5950 },
	{ rank: 20, userName: "chart_tracker", layerName: "ルーキー", score: 5720 },
];

const GROUP_RANKING_DATA: Record<string, ReadonlyArray<GroupRankingEntry>> = {
	...GROUP_RANKINGS_1,
	...GROUP_RANKINGS_2,
};

export function getGroupRankings(groupId: string): ReadonlyArray<GroupRankingEntry> {
	return GROUP_RANKING_DATA[groupId] ?? [];
}
