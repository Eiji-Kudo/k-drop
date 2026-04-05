import type { InferInsertModel } from "drizzle-orm";
import * as schema from "../../schema/index.ts";
import { DEFAULT_SNAPSHOT_DATE, NOW } from "./constants";
import { getTestFactories, type TestDb } from "./db";

type UserScoreStateInsert = Partial<InferInsertModel<typeof schema.userScoreStates>>;
type UserScoreSnapshotInsert = Partial<InferInsertModel<typeof schema.userScoreSnapshots>>;

export async function insertUserScoreState(sqliteDb: TestDb, values: UserScoreStateInsert = {}) {
	const scoreScope = values.scoreScope ?? "overall";
	const factories = getTestFactories(sqliteDb).userScoreStates;
	return scoreScope === "group"
		? factories.traits.group.create({
				userScoreStateId: values.userScoreStateId ?? "score-state-group-1",
				userId: values.userId ?? "user-1",
				idolGroupId: values.idolGroupId ?? "group-1",
				scoreTierId: values.scoreTierId ?? "tier-group-1",
				scoreTotal: values.scoreTotal ?? 0,
				answeredCount: values.answeredCount ?? 0,
				correctCount: values.correctCount ?? 0,
				lastAnsweredAt: values.lastAnsweredAt ?? null,
				updatedAt: values.updatedAt ?? NOW,
			})
		: factories.create({
				userScoreStateId: values.userScoreStateId ?? "score-state-1",
				userId: values.userId ?? "user-1",
				scoreScope,
				idolGroupId: values.idolGroupId ?? null,
				scoreTierId: values.scoreTierId ?? "tier-1",
				scoreTotal: values.scoreTotal ?? 0,
				answeredCount: values.answeredCount ?? 0,
				correctCount: values.correctCount ?? 0,
				lastAnsweredAt: values.lastAnsweredAt ?? null,
				updatedAt: values.updatedAt ?? NOW,
			});
}

export async function insertUserScoreSnapshot(sqliteDb: TestDb, values: UserScoreSnapshotInsert = {}) {
	const scoreScope = values.scoreScope ?? "overall";
	const factories = getTestFactories(sqliteDb).userScoreSnapshots;
	return scoreScope === "group"
		? factories.traits.group.create({
				userScoreSnapshotId: values.userScoreSnapshotId ?? "score-snapshot-group-1",
				userId: values.userId ?? "user-1",
				idolGroupId: values.idolGroupId ?? "group-1",
				snapshotDate: values.snapshotDate ?? DEFAULT_SNAPSHOT_DATE,
				scoreTotal: values.scoreTotal ?? 0,
				createdAt: values.createdAt ?? NOW,
			})
		: factories.create({
				userScoreSnapshotId: values.userScoreSnapshotId ?? "score-snapshot-1",
				userId: values.userId ?? "user-1",
				scoreScope,
				idolGroupId: values.idolGroupId ?? null,
				snapshotDate: values.snapshotDate ?? DEFAULT_SNAPSHOT_DATE,
				scoreTotal: values.scoreTotal ?? 0,
				createdAt: values.createdAt ?? NOW,
			});
}
