import { idolGroups } from "./groups";
import type { GroupRankingEntry, RankingEntry } from "./types";

export const totalRanking: RankingEntry[] = [
	{ rank: 1, userName: "kpop_queen_99", tierName: "マスター", score: 9850 },
	{ rank: 2, userName: "seoul_dreamer", tierName: "マスター", score: 9720 },
	{ rank: 3, userName: "hallyu_wave", tierName: "マスター", score: 9500 },
	{ rank: 4, userName: "idol_hunter_kr", tierName: "ダイヤモンド", score: 8900 },
	{ rank: 5, userName: "momo_loves_twice", tierName: "ダイヤモンド", score: 8750 },
	{ rank: 6, userName: "bias_wrecker_01", tierName: "ダイヤモンド", score: 8300 },
	{ rank: 7, userName: "fandom_united", tierName: "ダイヤモンド", score: 7900 },
	{ rank: 8, userName: "sakura_fan_22", tierName: "ダイヤモンド", score: 4250 },
	{ rank: 9, userName: "concert_mania", tierName: "プラチナ", score: 3800 },
	{ rank: 10, userName: "photo_card_pro", tierName: "プラチナ", score: 3650 },
	{ rank: 11, userName: "dance_cover_luv", tierName: "プラチナ", score: 3400 },
	{ rank: 12, userName: "lightstick_army", tierName: "プラチナ", score: 3200 },
	{ rank: 13, userName: "kpop_newbie_24", tierName: "ゴールド", score: 2800 },
	{ rank: 14, userName: "vocal_stan", tierName: "ゴールド", score: 2650 },
	{ rank: 15, userName: "debut_watcher", tierName: "ゴールド", score: 2400 },
	{ rank: 16, userName: "mv_reactor", tierName: "ゴールド", score: 2100 },
	{ rank: 17, userName: "album_collector", tierName: "シルバー", score: 1800 },
	{ rank: 18, userName: "stage_mix_fan", tierName: "シルバー", score: 1500 },
	{ rank: 19, userName: "variety_lover", tierName: "シルバー", score: 1200 },
	{ rank: 20, userName: "trainee_watcher", tierName: "ブロンズ", score: 800 },
];

const LE_SSERAFIM_NAME = idolGroups[0].groupName;
const NEWJEANS_NAME = idolGroups[1].groupName;
const AESPA_NAME = idolGroups[2].groupName;

export const groupRankings: Record<string, GroupRankingEntry[]> = {
	[idolGroups[0].idolGroupId]: [
		{ rank: 1, userName: "sakura_fan_22", tierName: "ダイヤモンド", groupName: LE_SSERAFIM_NAME, score: 2100 },
		{ rank: 2, userName: "fearless_4ever", tierName: "プラチナ", groupName: LE_SSERAFIM_NAME, score: 1850 },
		{ rank: 3, userName: "kazuha_ballet", tierName: "プラチナ", groupName: LE_SSERAFIM_NAME, score: 1700 },
		{ rank: 4, userName: "eunchae_smile", tierName: "ゴールド", groupName: LE_SSERAFIM_NAME, score: 1400 },
		{ rank: 5, userName: "chaewon_vocal", tierName: "ゴールド", groupName: LE_SSERAFIM_NAME, score: 1200 },
		{ rank: 6, userName: "yunjin_main", tierName: "ゴールド", groupName: LE_SSERAFIM_NAME, score: 1050 },
		{ rank: 7, userName: "antifragile_fan", tierName: "シルバー", groupName: LE_SSERAFIM_NAME, score: 850 },
		{ rank: 8, userName: "hybe_lover", tierName: "シルバー", groupName: LE_SSERAFIM_NAME, score: 700 },
		{ rank: 9, userName: "fearnot_tokyo", tierName: "シルバー", groupName: LE_SSERAFIM_NAME, score: 550 },
		{ rank: 10, userName: "le_beginner", tierName: "ブロンズ", groupName: LE_SSERAFIM_NAME, score: 300 },
	],
	[idolGroups[1].idolGroupId]: [
		{ rank: 1, userName: "bunnies_club", tierName: "マスター", groupName: NEWJEANS_NAME, score: 2500 },
		{ rank: 2, userName: "hype_boy_fan", tierName: "ダイヤモンド", groupName: NEWJEANS_NAME, score: 2200 },
		{ rank: 3, userName: "minji_bias", tierName: "ダイヤモンド", groupName: NEWJEANS_NAME, score: 1950 },
		{ rank: 4, userName: "ditto_lover", tierName: "プラチナ", groupName: NEWJEANS_NAME, score: 1700 },
		{ rank: 5, userName: "hanni_stan", tierName: "プラチナ", groupName: NEWJEANS_NAME, score: 1500 },
		{ rank: 6, userName: "danielle_au", tierName: "ゴールド", groupName: NEWJEANS_NAME, score: 1200 },
		{ rank: 7, userName: "cookie_crunch", tierName: "ゴールド", groupName: NEWJEANS_NAME, score: 1000 },
		{ rank: 8, userName: "attention_pls", tierName: "シルバー", groupName: NEWJEANS_NAME, score: 750 },
		{ rank: 9, userName: "haerin_cat", tierName: "シルバー", groupName: NEWJEANS_NAME, score: 500 },
		{ rank: 10, userName: "nj_newbie", tierName: "ブロンズ", groupName: NEWJEANS_NAME, score: 250 },
	],
	[idolGroups[2].idolGroupId]: [
		{ rank: 1, userName: "my_karina", tierName: "マスター", groupName: AESPA_NAME, score: 2800 },
		{ rank: 2, userName: "next_level_fan", tierName: "ダイヤモンド", groupName: AESPA_NAME, score: 2400 },
		{ rank: 3, userName: "winter_cold", tierName: "ダイヤモンド", groupName: AESPA_NAME, score: 2100 },
		{ rank: 4, userName: "ningning_vocal", tierName: "プラチナ", groupName: AESPA_NAME, score: 1800 },
		{ rank: 5, userName: "giselle_jp", tierName: "プラチナ", groupName: AESPA_NAME, score: 1600 },
		{ rank: 6, userName: "savage_queen", tierName: "ゴールド", groupName: AESPA_NAME, score: 1300 },
		{ rank: 7, userName: "kwangya_explorer", tierName: "ゴールド", groupName: AESPA_NAME, score: 1100 },
		{ rank: 8, userName: "black_mamba_kr", tierName: "シルバー", groupName: AESPA_NAME, score: 800 },
		{ rank: 9, userName: "supernova_hit", tierName: "シルバー", groupName: AESPA_NAME, score: 550 },
		{ rank: 10, userName: "ae_beginner", tierName: "ブロンズ", groupName: AESPA_NAME, score: 200 },
	],
};
