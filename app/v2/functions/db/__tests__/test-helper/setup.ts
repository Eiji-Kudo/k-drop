import { ensureBaseIdolGroup, ensureBaseUser } from "./base-fixtures";
import type { TestDb } from "./db";

export async function setupBaseData(sqliteDb: TestDb) {
	await ensureBaseUser(sqliteDb);
	await ensureBaseIdolGroup(sqliteDb);
}
