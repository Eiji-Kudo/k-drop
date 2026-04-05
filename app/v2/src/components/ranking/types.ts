export type TotalRankingEntry = {
	rank: number;
	userName: string;
	layerName: string;
	score: number;
};

export type GroupRankingEntry = {
	rank: number;
	userName: string;
	layerName: string;
	groupName: string;
	score: number;
};

export type IdolGroup = {
	id: string;
	name: string;
};
