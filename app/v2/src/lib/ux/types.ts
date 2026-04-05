export type HomeMotivationViewModel = {
	currentTierName: string;
	currentScore: number;
	nextTierName: string | null;
	pointsToNextTier: number | null;
	nextTierProgressPercent: number | null;
	weeklyPlayProgressLabel: string | null;
	recentGrowthLabel: string | null;
	fastestGrowingGroupLabel: string | null;
	primaryCtaLabel: string;
	primaryCtaHint: string;
	heroTitle: string;
	heroDescription: string;
	nextTierHint: string;
};

export type QuizResultMotivationViewModel = {
	correctCount: number;
	totalQuestionCount: number;
	gainedScore: number;
	resultHeadline: string;
	growthLabel: string | null;
	pointsToNextTier: number | null;
	deltaFromPreviousRunLabel: string | null;
	primaryRetryLabel: string;
	secondaryRetryLabel: string;
	nextTierName: string | null;
	progressPercent: number | null;
};

export type RankingMotivationViewModel = {
	scopeLabel: string;
	topThree: Array<{
		rank: number;
		userName: string;
		tierName: string;
		score: number;
	}>;
	aroundYou: {
		myRank: number;
		myScore: number;
		myTierName: string;
		neighbors: Array<{
			rank: number;
			userName: string;
			tierName: string;
			score: number;
			isSelf?: boolean;
		}>;
		pointsToNextRank: number | null;
	} | null;
	fullList: Array<{
		rank: number;
		userName: string;
		tierName: string;
		score: number;
		isSelf?: boolean;
	}>;
};

export type ProfileGrowthViewModel = {
	userName: string;
	nickname: string | null;
	currentTierName: string;
	currentScore: number;
	nextTierName: string | null;
	pointsToNextTier: number | null;
	fanSinceLabel: string;
	weeklyGrowthLabel: string | null;
	badges: Array<{
		name: string;
		level: "gold" | "silver" | "bronze";
		type: "quiz_master" | "concert_goer" | "photocard_collector" | "dance_cover_star";
	}>;
	nextBadgeHint: string | null;
	topGroups: Array<{
		groupName: string;
		scoreLabel: string | null;
		tierName: string | null;
	}>;
	description: string;
	recentGrowthHint: string;
};

export type ScoreTier = {
	name: string;
	minScore: number;
};

export type CurrentUserProfile = {
	displayName: string;
	rankingName: string;
	nickname: string;
	currentScore: number;
	fanSince: Date;
	weeklyGrowthPercent: number;
	description: string;
	badges: Array<{
		name: string;
		level: "gold" | "silver" | "bronze";
		type: "quiz_master" | "concert_goer" | "photocard_collector" | "dance_cover_star";
	}>;
	topGroups: Array<{
		groupName: string;
		score: number;
	}>;
};

export type RankingEntry = {
	rank: number;
	userName: string;
	layerName: string;
	score: number;
	groupName?: string;
};
