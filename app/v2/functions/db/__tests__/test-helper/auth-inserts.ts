import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import * as schema from "../../schema/index.ts";
import { ensureBaseUser } from "./base-fixtures";
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
	const user: InferSelectModel<typeof schema.users> = await getTestFactories(sqliteDb).users.traits.base.create({
		...values,
		userId,
		status,
		createdAt,
		updatedAt,
	});
	return user.userId;
}

export async function insertAuthIdentity(sqliteDb: TestDb, values: AuthIdentityInsert = {}) {
	if (!("userId" in values)) await ensureBaseUser(sqliteDb);
	return getTestFactories(sqliteDb).authIdentities.traits.base.create(values);
}

export async function insertUserProfile(sqliteDb: TestDb, values: UserProfileInsert = {}) {
	if (!("userId" in values)) await ensureBaseUser(sqliteDb);
	return getTestFactories(sqliteDb).userProfiles.traits.base.create(values);
}
