import { type DefineFactoryResolver, defineFactory } from "@praha/drizzle-factory";
import * as schema from "../../schema/index.ts";
import { usersFactory } from "./auth-factories";
import { NOW } from "./constants";
import { idolGroupsFactory } from "./group-factories";

export const leaderboardSnapshotsFactory = defineFactory({
	schema,
	table: "leaderboardSnapshots",
	resolver: ({ sequence }) => ({
		leaderboardSnapshotId: `leaderboard-${sequence}`,
		leaderboardScope: "overall",
		idolGroupId: null,
		snapshotAt: NOW,
		createdAt: NOW,
	}),
	traits: {
		base: (() => ({
			leaderboardSnapshotId: "leaderboard-1",
			leaderboardScope: "overall",
			idolGroupId: null,
			snapshotAt: NOW,
			createdAt: NOW,
		})) satisfies DefineFactoryResolver<typeof schema, "leaderboardSnapshots">,
		group: ({ sequence, use: related }) => ({
			leaderboardSnapshotId: `leaderboard-group-${sequence}`,
			leaderboardScope: "group",
			idolGroupId: () =>
				related(idolGroupsFactory)
					.create()
					.then((group) => group.idolGroupId),
			snapshotAt: NOW,
			createdAt: NOW,
		}),
		groupBase: (() => ({
			leaderboardSnapshotId: "leaderboard-group-1",
			leaderboardScope: "group",
			idolGroupId: "group-1",
			snapshotAt: NOW,
			createdAt: NOW,
		})) satisfies DefineFactoryResolver<typeof schema, "leaderboardSnapshots">,
	},
});

export const leaderboardEntriesFactory = defineFactory({
	schema,
	table: "leaderboardEntries",
	resolver: ({ sequence, use: related }) => ({
		leaderboardEntryId: `leaderboard-entry-${sequence}`,
		leaderboardSnapshotId: () =>
			related(leaderboardSnapshotsFactory)
				.create()
				.then((snapshot) => snapshot.leaderboardSnapshotId),
		userId: () =>
			related(usersFactory)
				.create()
				.then((user) => user.userId),
		displayRank: sequence,
		displayScore: 0,
	}),
	traits: {
		base: (() => ({
			leaderboardEntryId: "leaderboard-entry-1",
			leaderboardSnapshotId: "leaderboard-1",
			userId: "user-1",
			displayRank: 1,
			displayScore: 0,
		})) satisfies DefineFactoryResolver<typeof schema, "leaderboardEntries">,
	},
});
