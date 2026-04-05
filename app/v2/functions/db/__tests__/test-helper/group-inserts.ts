import type { InferInsertModel } from "drizzle-orm";
import * as schema from "../../schema/index.ts";
import { ensureBaseGroupCategory, ensureBaseIdolGroup, ensureBaseUser } from "./base-fixtures";
import { getTestFactories, type TestDb } from "./db";

type GroupCategoryInsert = Partial<InferInsertModel<typeof schema.groupCategories>>;
type IdolGroupInsert = Partial<InferInsertModel<typeof schema.idolGroups>>;
type UserFavoriteGroupInsert = Partial<InferInsertModel<typeof schema.userFavoriteGroups>>;

export async function insertGroupCategory(sqliteDb: TestDb, values: GroupCategoryInsert = {}) {
	const category = await getTestFactories(sqliteDb).groupCategories.traits.base.create(values);
	return category.groupCategoryId;
}

export async function insertIdolGroup(sqliteDb: TestDb, values: IdolGroupInsert = {}) {
	if (!("groupCategoryId" in values)) await ensureBaseGroupCategory(sqliteDb);
	const idolGroup = await getTestFactories(sqliteDb).idolGroups.traits.base.create(values);
	return idolGroup.idolGroupId;
}

export async function insertUserFavoriteGroup(sqliteDb: TestDb, values: UserFavoriteGroupInsert = {}) {
	if (!("userId" in values)) await ensureBaseUser(sqliteDb);
	if (!("idolGroupId" in values)) await ensureBaseIdolGroup(sqliteDb);
	return getTestFactories(sqliteDb).userFavoriteGroups.traits.base.create(values);
}
