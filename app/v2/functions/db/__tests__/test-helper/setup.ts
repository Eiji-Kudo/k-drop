import { insertUser } from "./auth-inserts";
import type { TestDb } from "./db";
import { insertGroupCategory, insertIdolGroup } from "./group-inserts";

export async function setupBaseData(sqliteDb: TestDb) {
	await insertUser(sqliteDb);
	await insertGroupCategory(sqliteDb);
	await insertIdolGroup(sqliteDb);
}
