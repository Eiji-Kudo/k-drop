import type { GroupCategory, IdolGroup } from "./types";

export const groupCategories: GroupCategory[] = [
	{ groupCategoryId: "01JQXV0001CATG0000000001", slug: "girl-group", categoryName: "ガールズグループ", sortOrder: 1 },
	{ groupCategoryId: "01JQXV0001CATG0000000002", slug: "boy-group", categoryName: "ボーイズグループ", sortOrder: 2 },
	{ groupCategoryId: "01JQXV0001CATG0000000003", slug: "co-ed", categoryName: "混合グループ", sortOrder: 3 },
];

const GIRL_GROUP_CATEGORY_ID = groupCategories[0].groupCategoryId;
const BOY_GROUP_CATEGORY_ID = groupCategories[1].groupCategoryId;

export const idolGroups: IdolGroup[] = [
	{
		idolGroupId: "01JQXV0001GRPA0000000001",
		groupCategoryId: GIRL_GROUP_CATEGORY_ID,
		slug: "le-sserafim",
		groupName: "LE SSERAFIM",
		thumbnailUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=lesserafim",
		status: "active",
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},
	{
		idolGroupId: "01JQXV0001GRPA0000000002",
		groupCategoryId: GIRL_GROUP_CATEGORY_ID,
		slug: "newjeans",
		groupName: "NewJeans",
		thumbnailUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=newjeans",
		status: "active",
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},
	{
		idolGroupId: "01JQXV0001GRPA0000000003",
		groupCategoryId: GIRL_GROUP_CATEGORY_ID,
		slug: "aespa",
		groupName: "aespa",
		thumbnailUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=aespa",
		status: "active",
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},
	{
		idolGroupId: "01JQXV0001GRPA0000000004",
		groupCategoryId: GIRL_GROUP_CATEGORY_ID,
		slug: "ive",
		groupName: "IVE",
		thumbnailUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=ive",
		status: "active",
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},
	{
		idolGroupId: "01JQXV0001GRPA0000000005",
		groupCategoryId: BOY_GROUP_CATEGORY_ID,
		slug: "stray-kids",
		groupName: "Stray Kids",
		thumbnailUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=straykids",
		status: "active",
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},
	{
		idolGroupId: "01JQXV0001GRPA0000000006",
		groupCategoryId: BOY_GROUP_CATEGORY_ID,
		slug: "seventeen",
		groupName: "SEVENTEEN",
		thumbnailUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=seventeen",
		status: "active",
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},
	{
		idolGroupId: "01JQXV0001GRPA0000000007",
		groupCategoryId: BOY_GROUP_CATEGORY_ID,
		slug: "enhypen",
		groupName: "ENHYPEN",
		thumbnailUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=enhypen",
		status: "active",
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},
	{
		idolGroupId: "01JQXV0001GRPA0000000008",
		groupCategoryId: GIRL_GROUP_CATEGORY_ID,
		slug: "itzy",
		groupName: "ITZY",
		thumbnailUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=itzy",
		status: "active",
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},
];
