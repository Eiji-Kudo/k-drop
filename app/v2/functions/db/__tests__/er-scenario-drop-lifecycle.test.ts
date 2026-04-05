// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestDb, insertUser, NOW } from "./test-helper";

let db: Database.Database;
beforeEach(() => {
	db = createTestDb();
	insertUser(db);
	db.prepare("INSERT INTO drop_wallets (user_id, balance, updated_at) VALUES (?,?,?)").run("user-1", 0, NOW);
});
afterEach(() => {
	db.close();
});

const addTx = (id: string, delta: number, reason: string, sourceType: string, sourceId: string | null = null) => {
	db.prepare(
		"INSERT INTO drop_transactions (drop_transaction_id, user_id, delta, reason, source_type, source_id, created_at) VALUES (?,?,?,?,?,?,?)",
	).run(id, "user-1", delta, reason, sourceType, sourceId, NOW);
	db.prepare("UPDATE drop_wallets SET balance = balance + ?, updated_at = ? WHERE user_id = ?").run(delta, NOW, "user-1");
};
const getBalance = () => (db.prepare("SELECT balance FROM drop_wallets WHERE user_id=?").get("user-1") as { balance: number }).balance;

describe("ドロップ報酬の蓄積と消費ライフサイクル", () => {
	it("クイズ報酬 → イベント報酬 → 消費 → 残高追跡", () => {
		db.transaction(() => addTx("tx-q1", 10, "quiz_reward", "quiz_session", "s1"))();
		expect(getBalance()).toBe(10);

		db.transaction(() => addTx("tx-q2", 15, "quiz_reward", "quiz_session", "s2"))();
		expect(getBalance()).toBe(25);

		db.transaction(() => addTx("tx-ev", 5, "event_reward", "event", "ev-1"))();
		expect(getBalance()).toBe(30);

		db.transaction(() => addTx("tx-use", -20, "consume", "shop"))();
		expect(getBalance()).toBe(10);

		const txs = db.prepare("SELECT * FROM drop_transactions WHERE user_id=? ORDER BY rowid").all("user-1") as Record<string, unknown>[];
		expect(txs).toHaveLength(4);
		expect(txs.map((t) => t.delta)).toEqual([10, 15, 5, -20]);
	});
});

describe("残高不足ガード", () => {
	it("残高をちょうど 0 にする消費は成功", () => {
		db.transaction(() => addTx("tx-in", 50, "quiz_reward", "quiz_session"))();
		expect(() => db.transaction(() => addTx("tx-out", -50, "consume", "shop"))()).not.toThrow();
		expect(getBalance()).toBe(0);
	});

	it("残高を 1 でも超える消費は拒否", () => {
		db.transaction(() => addTx("tx-in", 50, "quiz_reward", "quiz_session"))();
		expect(() => db.transaction(() => addTx("tx-out", -51, "consume", "shop"))()).toThrow();
		expect(getBalance()).toBe(50);
	});

	it("残高 0 からの消費は拒否", () => {
		expect(() => db.transaction(() => addTx("tx-out", -1, "consume", "shop"))()).toThrow();
		expect(getBalance()).toBe(0);
	});
});

describe("手動調整トランザクション", () => {
	it("manual_adjustment で残高を加算可能", () => {
		db.transaction(() => addTx("tx-adj", 100, "manual_adjustment", "admin"))();
		expect(getBalance()).toBe(100);
	});

	it("manual_adjustment で残高を減算可能（残高内なら）", () => {
		db.transaction(() => addTx("tx-in", 100, "quiz_reward", "quiz_session"))();
		db.transaction(() => addTx("tx-adj", -30, "manual_adjustment", "admin"))();
		expect(getBalance()).toBe(70);
	});
});

describe("トランザクション履歴の追跡可能性", () => {
	it("source_type と source_id で元データを追跡できる", () => {
		db.transaction(() => addTx("tx-1", 10, "quiz_reward", "quiz_session", "session-abc"))();
		const tx = db.prepare("SELECT * FROM drop_transactions WHERE drop_transaction_id=?").get("tx-1") as Record<string, unknown>;
		expect(tx.reason).toBe("quiz_reward");
		expect(tx.source_type).toBe("quiz_session");
		expect(tx.source_id).toBe("session-abc");
	});

	it("source_id は NULL 許容（手動調整など）", () => {
		expect(() => db.transaction(() => addTx("tx-1", 10, "manual_adjustment", "admin", null))()).not.toThrow();
	});
});
