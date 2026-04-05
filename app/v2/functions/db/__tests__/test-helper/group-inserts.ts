import type { InferInsertModel } from "drizzle-orm";
import * as schema from "../../schema/index.ts";
import { NOW } from "./constants";
import { getTestFactories, type TestDb } from "./db";

type GroupCategoryInsert = Partial<InferInsertModel<typeof schema.groupCategories>>;
type IdolGroupInsert = Partial<InferInsertModel<typeof schema.idolGroups>>;
type UserFavoriteGroupInsert = Partial<InferInsertModel<typeof schema.userFavoriteGroups>>;

export async function insertGroupCategory(sqliteDb: TestDb, values: GroupCategoryInsert = {}) {
	const category = await getTestFactories(sqliteDb).groupCategories.create({
		groupCategoryId: values.groupCategoryId ?? "cat-1",
		slug: values.slug ?? "kpop",
		categoryName: values.categoryName ?? "K-POP",
		sortOrder: values.sortOrder ?? 1,
	});
	return category.groupCategoryId;
}

export async function insertIdolGroup(sqliteDb: TestDb, values: IdolGroupInsert = {}) {
	const idolGroup = await getTestFactories(sqliteDb).idolGroups.create({
		idolGroupId: values.idolGroupId ?? "group-1",
		groupCategoryId: values.groupCategoryId ?? "cat-1",
		slug: values.slug ?? "twice",
		groupName: values.groupName ?? "TWICE",
		thumbnailUrl: values.thumbnailUrl ?? null,
		status: values.status ?? "active",
		createdAt: values.createdAt ?? NOW,
		updatedAt: values.updatedAt ?? NOW,
	});
	return idolGroup.idolGroupId;
}

export async function insertUserFavoriteGroup(sqliteDb: TestDb, values: UserFavoriteGroupInsert = {}) {
	return getTestFactories(sqliteDb).userFavoriteGroups.create({
		userFavoriteGroupId: values.userFavoriteGroupId ?? "fav-1",
		userId: values.userId ?? "user-1",
		idolGroupId: values.idolGroupId ?? "group-1",
		startedSupportingOn: values.startedSupportingOn ?? null,
		createdAt: values.createdAt ?? NOW,
	});
}
