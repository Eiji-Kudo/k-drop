import type { InferInsertModel } from "drizzle-orm";
import * as schema from "../../schema/index.ts";
import { DEFAULT_EVENT_ENDS_AT, DEFAULT_EVENT_STARTS_AT, NOW } from "./constants";
import { getTestFactories, type TestDb } from "./db";
import { isEventVisibility, isParticipationStatus } from "./types";

type EventInsert = Omit<Partial<InferInsertModel<typeof schema.events>>, "visibility"> & { visibility?: string };
type EventGroupInsert = Partial<InferInsertModel<typeof schema.eventGroups>>;
type EventParticipantInsert = Omit<Partial<InferInsertModel<typeof schema.eventParticipants>>, "participationStatus"> & {
	participationStatus?: string;
};

const insertEventWithRawVisibility = (
	sqliteDb: TestDb,
	values: Required<Pick<EventInsert, "eventId" | "createdByUserId" | "title" | "visibility" | "startsAt" | "endsAt" | "createdAt" | "updatedAt">> &
		Pick<EventInsert, "description" | "venueName" | "capacity">,
) => {
	sqliteDb
		.prepare(
			"INSERT INTO events (event_id, created_by_user_id, title, description, venue_name, visibility, capacity, starts_at, ends_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
		)
		.run(
			values.eventId,
			values.createdByUserId,
			values.title,
			values.description ?? null,
			values.venueName ?? null,
			values.visibility,
			values.capacity ?? null,
			values.startsAt,
			values.endsAt,
			values.createdAt,
			values.updatedAt,
		);
	return values.eventId;
};

export async function insertEvent(sqliteDb: TestDb, values: EventInsert = {}) {
	const eventId = values.eventId ?? "event-1";
	const createdByUserId = values.createdByUserId ?? "user-1";
	const title = values.title ?? "Event";
	const visibility = values.visibility ?? "public";
	const startsAt = values.startsAt ?? DEFAULT_EVENT_STARTS_AT;
	const endsAt = values.endsAt ?? DEFAULT_EVENT_ENDS_AT;
	const createdAt = values.createdAt ?? NOW;
	const updatedAt = values.updatedAt ?? NOW;
	if (!isEventVisibility(visibility))
		return insertEventWithRawVisibility(sqliteDb, {
			eventId,
			createdByUserId,
			title,
			visibility,
			startsAt,
			endsAt,
			createdAt,
			updatedAt,
			description: values.description,
			venueName: values.venueName,
			capacity: values.capacity,
		});
	return getTestFactories(sqliteDb).events.create({
		eventId,
		createdByUserId,
		title,
		description: values.description ?? null,
		venueName: values.venueName ?? null,
		visibility,
		capacity: values.capacity ?? null,
		startsAt,
		endsAt,
		createdAt,
		updatedAt,
	});
}

export async function insertEventGroup(sqliteDb: TestDb, values: EventGroupInsert = {}) {
	return getTestFactories(sqliteDb).eventGroups.create({
		eventGroupId: values.eventGroupId ?? "event-group-1",
		eventId: values.eventId ?? "event-1",
		idolGroupId: values.idolGroupId ?? "group-1",
		createdAt: values.createdAt ?? NOW,
	});
}

export async function insertEventParticipant(sqliteDb: TestDb, values: EventParticipantInsert = {}) {
	const eventParticipantId = values.eventParticipantId ?? "event-participant-1";
	const eventId = values.eventId ?? "event-1";
	const userId = values.userId ?? "user-1";
	const participationStatus = values.participationStatus ?? "joined";
	const joinedAt = values.joinedAt ?? NOW;
	const updatedAt = values.updatedAt ?? NOW;
	if (!isParticipationStatus(participationStatus)) {
		sqliteDb
			.prepare(
				"INSERT INTO event_participants (event_participant_id, event_id, user_id, participation_status, joined_at, updated_at) VALUES (?,?,?,?,?,?)",
			)
			.run(eventParticipantId, eventId, userId, participationStatus, joinedAt, updatedAt);
		return eventParticipantId;
	}
	return getTestFactories(sqliteDb).eventParticipants.create({ eventParticipantId, eventId, userId, participationStatus, joinedAt, updatedAt });
}
