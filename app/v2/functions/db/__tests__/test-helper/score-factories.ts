import { defineFactory } from "@praha/drizzle-factory";
import * as schema from "../../schema/index.ts";
import { usersFactory } from "./auth-factories";
import { DEFAULT_SNAPSHOT_DATE, NOW } from "./constants";
import { idolGroupsFactory } from "./group-factories";

export const scoreTiersFactory = defineFactory({
	schema,
	table: "scoreTiers",
	resolver: ({ sequence }) => ({
		scoreTierId: `tier-${sequence}`,
		tierScope: "overall",
		tierName: `Tier ${sequence}`,
		minScore: 0,
		maxScore: 100,
		sortOrder: sequence,
	}),
	traits: {
		group: ({ sequence }) => ({
			scoreTierId: `tier-group-${sequence}`,
			tierScope: "group",
			tierName: `Group Tier ${sequence}`,
			minScore: 0,
			maxScore: 100,
			sortOrder: sequence,
		}),
	},
});

export const userScoreStatesFactory = defineFactory({
	schema,
	table: "userScoreStates",
	resolver: ({ sequence, use: related }) => ({
		userScoreStateId: `score-state-${sequence}`,
		userId: () =>
			related(usersFactory)
				.create()
				.then((user) => user.userId),
		scoreScope: "overall",
		idolGroupId: null,
		scoreTierId: () =>
			related(scoreTiersFactory)
				.create()
				.then((tier) => tier.scoreTierId),
		scoreTotal: 0,
		answeredCount: 0,
		correctCount: 0,
		lastAnsweredAt: null,
		updatedAt: NOW,
	}),
	traits: {
		group: ({ sequence, use: related }) => ({
			userScoreStateId: `score-state-group-${sequence}`,
			userId: () =>
				related(usersFactory)
					.create()
					.then((user) => user.userId),
			scoreScope: "group",
			idolGroupId: () =>
				related(idolGroupsFactory)
					.create()
					.then((group) => group.idolGroupId),
			scoreTierId: () =>
				related(scoreTiersFactory)
					.traits.group.create()
					.then((tier) => tier.scoreTierId),
			scoreTotal: 0,
			answeredCount: 0,
			correctCount: 0,
			lastAnsweredAt: null,
			updatedAt: NOW,
		}),
	},
});

export const userScoreSnapshotsFactory = defineFactory({
	schema,
	table: "userScoreSnapshots",
	resolver: ({ sequence, use: related }) => ({
		userScoreSnapshotId: `score-snapshot-${sequence}`,
		userId: () =>
			related(usersFactory)
				.create()
				.then((user) => user.userId),
		scoreScope: "overall",
		idolGroupId: null,
		snapshotDate: DEFAULT_SNAPSHOT_DATE,
		scoreTotal: 0,
		createdAt: NOW,
	}),
	traits: {
		group: ({ sequence, use: related }) => ({
			userScoreSnapshotId: `score-snapshot-group-${sequence}`,
			userId: () =>
				related(usersFactory)
					.create()
					.then((user) => user.userId),
			scoreScope: "group",
			idolGroupId: () =>
				related(idolGroupsFactory)
					.create()
					.then((group) => group.idolGroupId),
			snapshotDate: DEFAULT_SNAPSHOT_DATE,
			scoreTotal: 0,
			createdAt: NOW,
		}),
	},
});
