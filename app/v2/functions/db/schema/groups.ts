import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { users } from "./users.ts";

export const groupCategories = sqliteTable("group_categories", {
	groupCategoryId: text("group_category_id").primaryKey(),
	slug: text("slug").notNull().unique(),
	categoryName: text("category_name").notNull(),
	sortOrder: integer("sort_order").notNull(),
});

export const idolGroups = sqliteTable(
	"idol_groups",
	{
		idolGroupId: text("idol_group_id").primaryKey(),
		groupCategoryId: text("group_category_id")
			.notNull()
			.references(() => groupCategories.groupCategoryId),
		slug: text("slug").notNull().unique(),
		groupName: text("group_name").notNull(),
		thumbnailUrl: text("thumbnail_url"),
		status: text("status", { enum: ["active", "inactive", "archived"] }).notNull(),
		createdAt: text("created_at").notNull(),
		updatedAt: text("updated_at").notNull(),
	},
	(table) => [
		index("idol_groups_group_category_id_idx").on(table.groupCategoryId),
		check("idol_groups_status_check", sql`${table.status} IN ('active', 'inactive', 'archived')`),
	],
);

export const userFavoriteGroups = sqliteTable(
	"user_favorite_groups",
	{
		userFavoriteGroupId: text("user_favorite_group_id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.userId, { onDelete: "cascade" }),
		idolGroupId: text("idol_group_id")
			.notNull()
			.references(() => idolGroups.idolGroupId, { onDelete: "cascade" }),
		startedSupportingOn: text("started_supporting_on"),
		createdAt: text("created_at").notNull(),
	},
	(table) => [unique().on(table.userId, table.idolGroupId), index("user_favorite_groups_idol_group_id_idx").on(table.idolGroupId)],
);
