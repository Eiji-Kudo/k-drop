import { defineFactory } from "@praha/drizzle-factory";
import * as schema from "../../schema/index.ts";
import { usersFactory } from "./auth-factories";
import { NOW } from "./constants";

export const groupCategoriesFactory = defineFactory({
	schema,
	table: "groupCategories",
	resolver: ({ sequence }) => ({
		groupCategoryId: `cat-${sequence}`,
		slug: `category-${sequence}`,
		categoryName: `Category ${sequence}`,
		sortOrder: sequence,
	}),
});

export const idolGroupsFactory = defineFactory({
	schema,
	table: "idolGroups",
	resolver: ({ sequence, use: related }) => ({
		idolGroupId: `group-${sequence}`,
		groupCategoryId: () =>
			related(groupCategoriesFactory)
				.create()
				.then((category) => category.groupCategoryId),
		slug: `group-${sequence}`,
		groupName: `Group ${sequence}`,
		thumbnailUrl: null,
		status: "active",
		createdAt: NOW,
		updatedAt: NOW,
	}),
});

export const userFavoriteGroupsFactory = defineFactory({
	schema,
	table: "userFavoriteGroups",
	resolver: ({ sequence, use: related }) => ({
		userFavoriteGroupId: `fav-${sequence}`,
		userId: () =>
			related(usersFactory)
				.create()
				.then((user) => user.userId),
		idolGroupId: () =>
			related(idolGroupsFactory)
				.create()
				.then((group) => group.idolGroupId),
		startedSupportingOn: null,
		createdAt: NOW,
	}),
});
