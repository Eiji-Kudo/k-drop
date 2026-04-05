import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../../schema/index.ts";
import { testFactories } from "./factories";

const MIGRATIONS_DIR = resolve(import.meta.dirname, "../../migrations");

export type TestDb = Database.Database;

const createDrizzleDb = (sqliteDb: TestDb) => drizzle(sqliteDb, { schema });

export function createTestDb(): TestDb {
	testFactories.resetSequence();
	const db = new Database(":memory:");
	db.pragma("journal_mode = WAL");
	db.pragma("foreign_keys = ON");
	for (const file of readdirSync(MIGRATIONS_DIR)
		.filter((entry) => entry.endsWith(".sql"))
		.sort()) {
		const sql = readFileSync(resolve(MIGRATIONS_DIR, file), "utf-8");
		for (const statement of sql
			.split("--> statement-breakpoint")
			.map((entry) => entry.trim())
			.filter(Boolean))
			db.exec(statement);
	}
	return db;
}

export function getTestFactories(sqliteDb: TestDb) {
	return testFactories(createDrizzleDb(sqliteDb));
}
