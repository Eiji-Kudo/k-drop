import { idolGroups } from "./groups";
import type { UserFavoriteGroup } from "./types";
import { currentUser } from "./users";

export const userFavoriteGroups: UserFavoriteGroup[] = [
	{
		userFavoriteGroupId: "01JQXV0001UFAV0000000001",
		userId: currentUser.userId,
		idolGroupId: idolGroups[0].idolGroupId,
		startedSupportingOn: "2022-05-01",
		createdAt: "2024-01-10T08:30:00Z",
	},
	{
		userFavoriteGroupId: "01JQXV0001UFAV0000000002",
		userId: currentUser.userId,
		idolGroupId: idolGroups[1].idolGroupId,
		startedSupportingOn: "2022-08-01",
		createdAt: "2024-01-10T08:31:00Z",
	},
	{
		userFavoriteGroupId: "01JQXV0001UFAV0000000003",
		userId: currentUser.userId,
		idolGroupId: idolGroups[2].idolGroupId,
		startedSupportingOn: "2023-01-15",
		createdAt: "2024-02-05T12:00:00Z",
	},
	{
		userFavoriteGroupId: "01JQXV0001UFAV0000000004",
		userId: currentUser.userId,
		idolGroupId: idolGroups[4].idolGroupId,
		startedSupportingOn: null,
		createdAt: "2024-03-01T09:00:00Z",
	},
];
