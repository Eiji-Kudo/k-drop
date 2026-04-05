export type GroupCategory = {
	groupCategoryId: string;
	slug: string;
	categoryName: string;
	sortOrder: number;
};

export type IdolGroupStatus = "active" | "inactive" | "archived";

export type IdolGroup = {
	idolGroupId: string;
	groupCategoryId: string;
	slug: string;
	groupName: string;
	thumbnailUrl: string | null;
	status: IdolGroupStatus;
	createdAt: string;
	updatedAt: string;
};
