import type { InferInsertModel } from "drizzle-orm";
import * as schema from "../../schema/index.ts";
import { NOW } from "./constants";
import { getTestFactories, type TestDb } from "./db";
import { isUserStatus } from "./types";

type UserInsert = Omit<Partial<InferInsertModel<typeof schema.users>>, "status"> & { status?: string };
type AuthIdentityInsert = Partial<InferInsertModel<typeof schema.authIdentities>>;
type UserProfileInsert = Partial<InferInsertModel<typeof schema.userProfiles>>;

const insertUserWithRawStatus = (sqliteDb: TestDb, userId: string, status: string, createdAt: string, updatedAt: string) => {
	sqliteDb.prepare("INSERT INTO users (user_id, status, created_at, updated_at) VALUES (?,?,?,?)").run(userId, status, createdAt, updatedAt);
	return userId;
};

export async function insertUser(sqliteDb: TestDb, values: UserInsert = {}) {
	const userId = values.userId ?? "user-1";
	const status = values.status ?? "active";
	const createdAt = values.createdAt ?? NOW;
	const updatedAt = values.updatedAt ?? NOW;
	if (!isUserStatus(status)) return insertUserWithRawStatus(sqliteDb, userId, status, createdAt, updatedAt);
	const user = await getTestFactories(sqliteDb).users.create({ userId, status, createdAt, updatedAt });
	return user.userId;
}

export async function insertAuthIdentity(sqliteDb: TestDb, values: AuthIdentityInsert = {}) {
	return getTestFactories(sqliteDb).authIdentities.create({
		authIdentityId: values.authIdentityId ?? "auth-1",
		userId: values.userId ?? "user-1",
		provider: values.provider ?? "google",
		providerSubjectId: values.providerSubjectId ?? "subject-1",
		createdAt: values.createdAt ?? NOW,
		updatedAt: values.updatedAt ?? NOW,
	});
}

export async function insertUserProfile(sqliteDb: TestDb, values: UserProfileInsert = {}) {
	return getTestFactories(sqliteDb).userProfiles.create({
		userId: values.userId ?? "user-1",
		handle: values.handle ?? "handle-1",
		displayName: values.displayName ?? "User 1",
		avatarUrl: values.avatarUrl ?? null,
		bio: values.bio ?? null,
		fanSince: values.fanSince ?? null,
		createdAt: values.createdAt ?? NOW,
		updatedAt: values.updatedAt ?? NOW,
	});
}
