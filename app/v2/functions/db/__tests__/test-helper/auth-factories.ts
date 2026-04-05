import { type DefineFactoryResolver, defineFactory } from "@praha/drizzle-factory";
import * as schema from "../../schema/index.ts";
import { NOW } from "./constants";

export const usersFactory = defineFactory({
	schema,
	table: "users",
	resolver: ({ sequence }) => ({ userId: `user-${sequence}`, status: "active", createdAt: NOW, updatedAt: NOW }),
	traits: {
		base: (() => ({ userId: "user-1", status: "active", createdAt: NOW, updatedAt: NOW })) satisfies DefineFactoryResolver<typeof schema, "users">,
	},
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
	traits: {
		base: (() => ({
			authIdentityId: "auth-1",
			userId: "user-1",
			provider: "google",
			providerSubjectId: "subject-1",
			createdAt: NOW,
			updatedAt: NOW,
		})) satisfies DefineFactoryResolver<typeof schema, "authIdentities">,
	},
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
	traits: {
		base: (() => ({
			userId: "user-1",
			handle: "handle-1",
			displayName: "User 1",
			avatarUrl: null,
			bio: null,
			fanSince: null,
			createdAt: NOW,
			updatedAt: NOW,
		})) satisfies DefineFactoryResolver<typeof schema, "userProfiles">,
	},
});
