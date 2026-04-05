import type { InferInsertModel } from "drizzle-orm";
import * as schema from "../../schema/index.ts";
import { ensureBaseIdolGroup, ensureBaseLeaderboardSnapshot, ensureBaseUser } from "./base-fixtures";
import { NOW } from "./constants";
import { getTestFactories, type TestDb } from "./db";
import { isScope } from "./types";

type LeaderboardSnapshotInsert = Omit<Partial<InferInsertModel<typeof schema.leaderboardSnapshots>>, "leaderboardScope"> & {
	leaderboardScope?: string;
};
type LeaderboardEntryInsert = Partial<InferInsertModel<typeof schema.leaderboardEntries>>;

export async function insertLeaderboardSnapshot(sqliteDb: TestDb, values: LeaderboardSnapshotInsert = {}) {
	const leaderboardScope = values.leaderboardScope ?? "overall";
	const leaderboardSnapshotId = values.leaderboardSnapshotId ?? (leaderboardScope === "group" ? "leaderboard-group-1" : "leaderboard-1");
	const snapshotAt = values.snapshotAt ?? NOW;
	const createdAt = values.createdAt ?? NOW;
	if (!isScope(leaderboardScope)) {
		sqliteDb
			.prepare(
				"INSERT INTO leaderboard_snapshots (leaderboard_snapshot_id, leaderboard_scope, idol_group_id, snapshot_at, created_at) VALUES (?,?,?,?,?)",
			)
			.run(leaderboardSnapshotId, leaderboardScope, values.idolGroupId ?? null, snapshotAt, createdAt);
		return leaderboardSnapshotId;
	}
	const factories = getTestFactories(sqliteDb).leaderboardSnapshots;
	if (leaderboardScope === "group" && !("idolGroupId" in values)) await ensureBaseIdolGroup(sqliteDb);
	return leaderboardScope === "group"
		? factories.traits.groupBase.create({
				...values,
				leaderboardSnapshotId,
				leaderboardScope,
				snapshotAt,
				createdAt,
			})
		: factories.traits.base.create({
				...values,
				leaderboardSnapshotId,
				leaderboardScope,
				snapshotAt,
				createdAt,
			});
}

export async function insertLeaderboardEntry(sqliteDb: TestDb, values: LeaderboardEntryInsert = {}) {
	if (!("leaderboardSnapshotId" in values)) await ensureBaseLeaderboardSnapshot(sqliteDb);
	if (!("userId" in values)) await ensureBaseUser(sqliteDb);
	return getTestFactories(sqliteDb).leaderboardEntries.traits.base.create(values);
}
