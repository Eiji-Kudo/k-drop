export type RankingEntry = {
	rank: number;
	userName: string;
	tierName: string;
	score: number;
};

export type GroupRankingEntry = RankingEntry & {
	groupName: string;
};
