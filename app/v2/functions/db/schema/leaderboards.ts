import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, unique, uniqueIndex } from "drizzle-orm/sqlite-core";
import { idolGroups } from "./groups.ts";
import { users } from "./users.ts";

export const leaderboardSnapshots = sqliteTable(
	"leaderboard_snapshots",
	{
		leaderboardSnapshotId: text("leaderboard_snapshot_id").primaryKey(),
		leaderboardScope: text("leaderboard_scope", { enum: ["overall", "group"] }).notNull(),
		idolGroupId: text("idol_group_id").references(() => idolGroups.idolGroupId, { onDelete: "cascade" }),
		snapshotAt: text("snapshot_at").notNull(),
		createdAt: text("created_at").notNull(),
	},
	(table) => [
		index("leaderboard_snapshots_idol_group_id_idx").on(table.idolGroupId),
		uniqueIndex("leaderboard_snapshots_overall_unique")
			.on(table.leaderboardScope, table.snapshotAt)
			.where(sql`${table.idolGroupId} IS NULL`),
		uniqueIndex("leaderboard_snapshots_group_unique")
			.on(table.leaderboardScope, table.idolGroupId, table.snapshotAt)
			.where(sql`${table.idolGroupId} IS NOT NULL`),
	],
);

export const leaderboardEntries = sqliteTable(
	"leaderboard_entries",
	{
		leaderboardEntryId: text("leaderboard_entry_id").primaryKey(),
		leaderboardSnapshotId: text("leaderboard_snapshot_id")
			.notNull()
			.references(() => leaderboardSnapshots.leaderboardSnapshotId, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => users.userId, { onDelete: "cascade" }),
		displayRank: integer("display_rank").notNull(),
		displayScore: integer("display_score").notNull(),
	},
	(table) => [
		unique().on(table.leaderboardSnapshotId, table.userId),
		unique().on(table.leaderboardSnapshotId, table.displayRank),
		index("leaderboard_entries_user_id_idx").on(table.userId),
	],
);
