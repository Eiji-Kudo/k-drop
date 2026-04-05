import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text, unique, uniqueIndex } from "drizzle-orm/sqlite-core";
import { idolGroups } from "./groups.ts";
import { users } from "./users.ts";

export const scoreTiers = sqliteTable(
	"score_tiers",
	{
		scoreTierId: text("score_tier_id").primaryKey(),
		tierScope: text("tier_scope", { enum: ["overall", "group"] }).notNull(),
		tierName: text("tier_name").notNull(),
		minScore: integer("min_score").notNull(),
		maxScore: integer("max_score").notNull(),
		sortOrder: integer("sort_order").notNull(),
	},
	(table) => [unique().on(table.tierScope, table.tierName), check("score_tiers_range_check", sql`${table.minScore} <= ${table.maxScore}`)],
);

export const userScoreStates = sqliteTable(
	"user_score_states",
	{
		userScoreStateId: text("user_score_state_id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.userId, { onDelete: "cascade" }),
		scoreScope: text("score_scope", { enum: ["overall", "group"] }).notNull(),
		idolGroupId: text("idol_group_id").references(() => idolGroups.idolGroupId, { onDelete: "cascade" }),
		scoreTierId: text("score_tier_id")
			.notNull()
			.references(() => scoreTiers.scoreTierId),
		scoreTotal: integer("score_total").notNull(),
		answeredCount: integer("answered_count").notNull(),
		correctCount: integer("correct_count").notNull(),
		lastAnsweredAt: text("last_answered_at"),
		updatedAt: text("updated_at").notNull(),
	},
	(table) => [
		uniqueIndex("user_score_states_overall_scope").on(table.userId, table.scoreScope).where(sql`${table.idolGroupId} IS NULL`),
		uniqueIndex("user_score_states_group_scope").on(table.userId, table.scoreScope, table.idolGroupId).where(sql`${table.idolGroupId} IS NOT NULL`),
		index("user_score_states_score_tier_id_idx").on(table.scoreTierId),
		check("user_score_states_score_total_min", sql`${table.scoreTotal} >= 0`),
		check("user_score_states_answered_count_min", sql`${table.answeredCount} >= 0`),
		check("user_score_states_correct_count_min", sql`${table.correctCount} >= 0`),
		check("user_score_states_correct_le_answered", sql`${table.correctCount} <= ${table.answeredCount}`),
		check(
			"user_score_states_scope_group_match",
			sql`(${table.scoreScope} = 'overall' AND ${table.idolGroupId} IS NULL) OR (${table.scoreScope} = 'group' AND ${table.idolGroupId} IS NOT NULL)`,
		),
	],
);

export const userScoreSnapshots = sqliteTable(
	"user_score_snapshots",
	{
		userScoreSnapshotId: text("user_score_snapshot_id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.userId, { onDelete: "cascade" }),
		scoreScope: text("score_scope", { enum: ["overall", "group"] }).notNull(),
		idolGroupId: text("idol_group_id").references(() => idolGroups.idolGroupId, { onDelete: "cascade" }),
		snapshotDate: text("snapshot_date").notNull(),
		scoreTotal: integer("score_total").notNull(),
		createdAt: text("created_at").notNull(),
	},
	(table) => [
		uniqueIndex("user_score_snapshots_overall_scope").on(table.userId, table.scoreScope, table.snapshotDate).where(sql`${table.idolGroupId} IS NULL`),
		uniqueIndex("user_score_snapshots_group_scope")
			.on(table.userId, table.scoreScope, table.idolGroupId, table.snapshotDate)
			.where(sql`${table.idolGroupId} IS NOT NULL`),
		index("user_score_snapshots_user_id_idx").on(table.userId, table.snapshotDate),
		check("user_score_snapshots_score_total_min", sql`${table.scoreTotal} >= 0`),
		check(
			"user_score_snapshots_scope_group_match",
			sql`(${table.scoreScope} = 'overall' AND ${table.idolGroupId} IS NULL) OR (${table.scoreScope} = 'group' AND ${table.idolGroupId} IS NOT NULL)`,
		),
	],
);
