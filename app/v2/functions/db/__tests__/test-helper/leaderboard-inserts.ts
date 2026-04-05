import type { InferInsertModel } from "drizzle-orm";
import * as schema from "../../schema/index.ts";
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
	const groupId = "idolGroupId" in values ? values.idolGroupId : "group-1";
	if (!isScope(leaderboardScope)) {
		sqliteDb
			.prepare(
				"INSERT INTO leaderboard_snapshots (leaderboard_snapshot_id, leaderboard_scope, idol_group_id, snapshot_at, created_at) VALUES (?,?,?,?,?)",
			)
			.run(leaderboardSnapshotId, leaderboardScope, values.idolGroupId ?? null, snapshotAt, createdAt);
		return leaderboardSnapshotId;
	}
	const factories = getTestFactories(sqliteDb).leaderboardSnapshots;
	return leaderboardScope === "group"
		? factories.traits.group.create({ leaderboardSnapshotId, idolGroupId: groupId, snapshotAt, createdAt })
		: factories.create({ leaderboardSnapshotId, leaderboardScope, idolGroupId: values.idolGroupId ?? null, snapshotAt, createdAt });
}

export async function insertLeaderboardEntry(sqliteDb: TestDb, values: LeaderboardEntryInsert = {}) {
	return getTestFactories(sqliteDb).leaderboardEntries.create({
		leaderboardEntryId: values.leaderboardEntryId ?? "leaderboard-entry-1",
		leaderboardSnapshotId: values.leaderboardSnapshotId ?? "leaderboard-1",
		userId: values.userId ?? "user-1",
		displayRank: values.displayRank ?? 1,
		displayScore: values.displayScore ?? 0,
	});
}
