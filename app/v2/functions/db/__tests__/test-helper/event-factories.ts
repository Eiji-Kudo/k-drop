import { defineFactory } from "@praha/drizzle-factory";
import * as schema from "../../schema/index.ts";
import { usersFactory } from "./auth-factories";
import { DEFAULT_EVENT_ENDS_AT, DEFAULT_EVENT_STARTS_AT, NOW } from "./constants";
import { idolGroupsFactory } from "./group-factories";

export const eventsFactory = defineFactory({
	schema,
	table: "events",
	resolver: ({ sequence, use: related }) => ({
		eventId: `event-${sequence}`,
		createdByUserId: () =>
			related(usersFactory)
				.create()
				.then((user) => user.userId),
		title: `Event ${sequence}`,
		description: null,
		venueName: null,
		visibility: "public",
		capacity: null,
		startsAt: DEFAULT_EVENT_STARTS_AT,
		endsAt: DEFAULT_EVENT_ENDS_AT,
		createdAt: NOW,
		updatedAt: NOW,
	}),
});

export const eventGroupsFactory = defineFactory({
	schema,
	table: "eventGroups",
	resolver: ({ sequence, use: related }) => ({
		eventGroupId: `event-group-${sequence}`,
		eventId: () =>
			related(eventsFactory)
				.create()
				.then((event) => event.eventId),
		idolGroupId: () =>
			related(idolGroupsFactory)
				.create()
				.then((group) => group.idolGroupId),
		createdAt: NOW,
	}),
});

export const eventParticipantsFactory = defineFactory({
	schema,
	table: "eventParticipants",
	resolver: ({ sequence, use: related }) => ({
		eventParticipantId: `event-participant-${sequence}`,
		eventId: () =>
			related(eventsFactory)
				.create()
				.then((event) => event.eventId),
		userId: () =>
			related(usersFactory)
				.create()
				.then((user) => user.userId),
		participationStatus: "joined",
		joinedAt: NOW,
		updatedAt: NOW,
	}),
});
