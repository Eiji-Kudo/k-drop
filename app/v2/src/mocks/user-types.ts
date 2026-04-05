export type UserStatus = "active" | "suspended" | "deleted";

export type User = {
	userId: string;
	status: UserStatus;
	createdAt: string;
	updatedAt: string;
};

export type UserProfile = {
	userId: string;
	handle: string;
	displayName: string;
	avatarUrl: string | null;
	bio: string | null;
	fanSince: string | null;
	createdAt: string;
	updatedAt: string;
};

export type TierScope = "overall" | "group";

export type ScoreTier = {
	scoreTierId: string;
	tierScope: TierScope;
	tierName: string;
	minScore: number;
	maxScore: number;
	sortOrder: number;
};

export type UserScoreState = {
	userScoreStateId: string;
	userId: string;
	scoreScope: TierScope;
	idolGroupId: string | null;
	scoreTierId: string;
	scoreTotal: number;
	answeredCount: number;
	correctCount: number;
	lastAnsweredAt: string | null;
	updatedAt: string;
};

export type CurrentUser = {
	userId: string;
	handle: string;
	displayName: string;
	avatarUrl: string | null;
	bio: string | null;
	fanSince: string | null;
	createdAt: string;
	totalScore: number;
	tierName: string;
	tierStars: number;
};
