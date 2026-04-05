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
