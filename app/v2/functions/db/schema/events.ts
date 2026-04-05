import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { idolGroups } from "./groups.ts";
import { users } from "./users.ts";

export const events = sqliteTable(
	"events",
	{
		eventId: text("event_id").primaryKey(),
		createdByUserId: text("created_by_user_id")
			.notNull()
			.references(() => users.userId, { onDelete: "cascade" }),
		title: text("title").notNull(),
		description: text("description"),
		venueName: text("venue_name"),
		visibility: text("visibility", { enum: ["public", "private", "unlisted"] }).notNull(),
		capacity: integer("capacity"),
		startsAt: text("starts_at").notNull(),
		endsAt: text("ends_at").notNull(),
		createdAt: text("created_at").notNull(),
		updatedAt: text("updated_at").notNull(),
	},
	(table) => [
		index("events_created_by_user_id_idx").on(table.createdByUserId),
		check("events_capacity_check", sql`${table.capacity} IS NULL OR ${table.capacity} > 0`),
		check("events_dates_check", sql`${table.endsAt} >= ${table.startsAt}`),
		check("events_visibility_check", sql`${table.visibility} IN ('public', 'private', 'unlisted')`),
	],
);

export const eventGroups = sqliteTable(
	"event_groups",
	{
		eventGroupId: text("event_group_id").primaryKey(),
		eventId: text("event_id")
			.notNull()
			.references(() => events.eventId, { onDelete: "cascade" }),
		idolGroupId: text("idol_group_id")
			.notNull()
			.references(() => idolGroups.idolGroupId, { onDelete: "cascade" }),
		createdAt: text("created_at").notNull(),
	},
	(table) => [unique().on(table.eventId, table.idolGroupId), index("event_groups_idol_group_id_idx").on(table.idolGroupId)],
);

export const eventParticipants = sqliteTable(
	"event_participants",
	{
		eventParticipantId: text("event_participant_id").primaryKey(),
		eventId: text("event_id")
			.notNull()
			.references(() => events.eventId, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => users.userId, { onDelete: "cascade" }),
		participationStatus: text("participation_status", { enum: ["joined", "waitlisted", "cancelled"] }).notNull(),
		joinedAt: text("joined_at").notNull(),
		updatedAt: text("updated_at").notNull(),
	},
	(table) => [
		unique().on(table.eventId, table.userId),
		index("event_participants_user_id_idx").on(table.userId),
		check("event_participants_status_check", sql`${table.participationStatus} IN ('joined', 'waitlisted', 'cancelled')`),
	],
);
