import { sql } from "drizzle-orm";
import { check, index, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
	"users",
	{
		userId: text("user_id").primaryKey(),
		status: text("status", { enum: ["active", "suspended", "deleted"] }).notNull(),
		createdAt: text("created_at").notNull(),
		updatedAt: text("updated_at").notNull(),
	},
	(table) => [check("users_status_check", sql`${table.status} IN ('active', 'suspended', 'deleted')`)],
);

export const authIdentities = sqliteTable(
	"auth_identities",
	{
		authIdentityId: text("auth_identity_id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.userId, { onDelete: "cascade" }),
		provider: text("provider").notNull(),
		providerSubjectId: text("provider_subject_id").notNull(),
		createdAt: text("created_at").notNull(),
		updatedAt: text("updated_at").notNull(),
	},
	(table) => [unique().on(table.provider, table.providerSubjectId), index("auth_identities_user_id_idx").on(table.userId)],
);

export const userProfiles = sqliteTable("user_profiles", {
	userId: text("user_id")
		.primaryKey()
		.references(() => users.userId, { onDelete: "cascade" }),
	handle: text("handle").notNull().unique(),
	displayName: text("display_name").notNull(),
	avatarUrl: text("avatar_url"),
	bio: text("bio"),
	fanSince: text("fan_since"),
	createdAt: text("created_at").notNull(),
	updatedAt: text("updated_at").notNull(),
});
