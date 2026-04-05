import { type DefineFactoryResolver, defineFactory } from "@praha/drizzle-factory";
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
		base: (() => ({
			scoreTierId: "tier-1",
			tierScope: "overall",
			tierName: "Bronze",
			minScore: 0,
			maxScore: 100,
			sortOrder: 1,
		})) satisfies DefineFactoryResolver<typeof schema, "scoreTiers">,
		group: ({ sequence }) => ({
			scoreTierId: `tier-group-${sequence}`,
			tierScope: "group",
			tierName: `Group Tier ${sequence}`,
			minScore: 0,
			maxScore: 100,
			sortOrder: sequence,
		}),
		groupBase: (() => ({
			scoreTierId: "tier-group-1",
			tierScope: "group",
			tierName: "Bronze",
			minScore: 0,
			maxScore: 100,
			sortOrder: 1,
		})) satisfies DefineFactoryResolver<typeof schema, "scoreTiers">,
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
		base: (() => ({
			userScoreStateId: "score-state-1",
			userId: "user-1",
			scoreScope: "overall",
			idolGroupId: null,
			scoreTierId: "tier-1",
			scoreTotal: 0,
			answeredCount: 0,
			correctCount: 0,
			lastAnsweredAt: null,
			updatedAt: NOW,
		})) satisfies DefineFactoryResolver<typeof schema, "userScoreStates">,
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
		groupBase: (() => ({
			userScoreStateId: "score-state-group-1",
			userId: "user-1",
			scoreScope: "group",
			idolGroupId: "group-1",
			scoreTierId: "tier-group-1",
			scoreTotal: 0,
			answeredCount: 0,
			correctCount: 0,
			lastAnsweredAt: null,
			updatedAt: NOW,
		})) satisfies DefineFactoryResolver<typeof schema, "userScoreStates">,
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
		base: (() => ({
			userScoreSnapshotId: "score-snapshot-1",
			userId: "user-1",
			scoreScope: "overall",
			idolGroupId: null,
			snapshotDate: DEFAULT_SNAPSHOT_DATE,
			scoreTotal: 0,
			createdAt: NOW,
		})) satisfies DefineFactoryResolver<typeof schema, "userScoreSnapshots">,
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
		groupBase: (() => ({
			userScoreSnapshotId: "score-snapshot-group-1",
			userId: "user-1",
			scoreScope: "group",
			idolGroupId: "group-1",
			snapshotDate: DEFAULT_SNAPSHOT_DATE,
			scoreTotal: 0,
			createdAt: NOW,
		})) satisfies DefineFactoryResolver<typeof schema, "userScoreSnapshots">,
	},
});
