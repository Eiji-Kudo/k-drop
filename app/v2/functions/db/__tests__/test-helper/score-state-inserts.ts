import type { InferInsertModel } from "drizzle-orm";
import * as schema from "../../schema/index.ts";
import { ensureBaseGroupScoreTier, ensureBaseIdolGroup, ensureBaseScoreTier, ensureBaseUser } from "./base-fixtures";
import { getTestFactories, type TestDb } from "./db";

type UserScoreStateInsert = Partial<InferInsertModel<typeof schema.userScoreStates>>;
type UserScoreSnapshotInsert = Partial<InferInsertModel<typeof schema.userScoreSnapshots>>;

export async function insertUserScoreState(sqliteDb: TestDb, values: UserScoreStateInsert = {}) {
	const scoreScope = values.scoreScope ?? "overall";
	const factories = getTestFactories(sqliteDb).userScoreStates;
	if (!("userId" in values)) await ensureBaseUser(sqliteDb);
	if (scoreScope === "group") {
		if (!("idolGroupId" in values)) await ensureBaseIdolGroup(sqliteDb);
		if (!("scoreTierId" in values)) await ensureBaseGroupScoreTier(sqliteDb);
		return factories.traits.groupBase.create(values);
	}
	if (!("scoreTierId" in values)) await ensureBaseScoreTier(sqliteDb);
	return factories.traits.base.create(values);
}

export async function insertUserScoreSnapshot(sqliteDb: TestDb, values: UserScoreSnapshotInsert = {}) {
	const scoreScope = values.scoreScope ?? "overall";
	const factories = getTestFactories(sqliteDb).userScoreSnapshots;
	if (!("userId" in values)) await ensureBaseUser(sqliteDb);
	if (scoreScope === "group") {
		if (!("idolGroupId" in values)) await ensureBaseIdolGroup(sqliteDb);
		return factories.traits.groupBase.create(values);
	}
	return factories.traits.base.create(values);
}
