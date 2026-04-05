import { defineFactory } from "@praha/drizzle-factory";
import * as schema from "../../schema/index.ts";
import { NOW } from "./constants";

export const usersFactory = defineFactory({
	schema,
	table: "users",
	resolver: ({ sequence }) => ({ userId: `user-${sequence}`, status: "active", createdAt: NOW, updatedAt: NOW }),
});

export const authIdentitiesFactory = defineFactory({
	schema,
	table: "authIdentities",
	resolver: ({ sequence, use: related }) => ({
		authIdentityId: `auth-${sequence}`,
		userId: () =>
			related(usersFactory)
				.create()
				.then((user) => user.userId),
		provider: `provider-${sequence}`,
		providerSubjectId: `subject-${sequence}`,
		createdAt: NOW,
		updatedAt: NOW,
	}),
});

export const userProfilesFactory = defineFactory({
	schema,
	table: "userProfiles",
	resolver: ({ sequence, use: related }) => ({
		userId: () =>
			related(usersFactory)
				.create()
				.then((user) => user.userId),
		handle: `handle-${sequence}`,
		displayName: `User ${sequence}`,
		avatarUrl: null,
		bio: null,
		fanSince: null,
		createdAt: NOW,
		updatedAt: NOW,
	}),
});
