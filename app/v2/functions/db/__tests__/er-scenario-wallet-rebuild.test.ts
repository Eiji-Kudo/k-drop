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

const addTx = (id: string, delta: number, reason: string) => {
	db.prepare("INSERT INTO drop_transactions (drop_transaction_id, user_id, delta, reason, source_type, created_at) VALUES (?,?,?,?,?,?)").run(
		id,
		"user-1",
		delta,
		reason,
		"system",
		NOW,
	);
	db.prepare("UPDATE drop_wallets SET balance=balance+?, updated_at=? WHERE user_id=?").run(delta, NOW, "user-1");
};
const getBalance = () => (db.prepare("SELECT balance FROM drop_wallets WHERE user_id=?").get("user-1") as { balance: number }).balance;

describe("トランザクション履歴からの残高再計算", () => {
	it("履歴の SUM(delta) がウォレット残高と一致する", () => {
		db.transaction(() => {
			addTx("t1", 100, "quiz_reward");
			addTx("t2", 50, "event_reward");
			addTx("t3", -30, "consume");
			addTx("t4", 200, "quiz_reward");
			addTx("t5", -80, "consume");
		})();

		const walletBalance = getBalance();
		const txSum = (db.prepare("SELECT SUM(delta) as total FROM drop_transactions WHERE user_id=?").get("user-1") as { total: number }).total;
		expect(walletBalance).toBe(240);
		expect(txSum).toBe(walletBalance);
	});

	it("ウォレット残高がずれた場合にトランザクションから再構築可能", () => {
		db.transaction(() => {
			addTx("t1", 100, "quiz_reward");
			addTx("t2", -40, "consume");
		})();

		const correctBalance = (db.prepare("SELECT SUM(delta) as total FROM drop_transactions WHERE user_id=?").get("user-1") as { total: number }).total;
		db.prepare("UPDATE drop_wallets SET balance=?, updated_at=? WHERE user_id=?").run(correctBalance, NOW, "user-1");
		expect(getBalance()).toBe(60);
	});
});

describe("複数ユーザーのウォレット独立性", () => {
	beforeEach(() => {
		insertUser(db, { userId: "user-2" });
		db.prepare("INSERT INTO drop_wallets (user_id, balance, updated_at) VALUES (?,?,?)").run("user-2", 0, NOW);
	});

	it("各ユーザーの残高が独立に管理される", () => {
		db.transaction(() => {
			addTx("t1", 100, "quiz_reward");
			db.prepare("INSERT INTO drop_transactions (drop_transaction_id, user_id, delta, reason, source_type, created_at) VALUES (?,?,?,?,?,?)").run(
				"t2",
				"user-2",
				50,
				"quiz_reward",
				"system",
				NOW,
			);
			db.prepare("UPDATE drop_wallets SET balance=balance+50, updated_at=? WHERE user_id=?").run(NOW, "user-2");
		})();

		expect(getBalance()).toBe(100);
		expect((db.prepare("SELECT balance FROM drop_wallets WHERE user_id=?").get("user-2") as { balance: number }).balance).toBe(50);
	});
});

describe("トランザクション理由の追跡", () => {
	it("reason 別に集計可能", () => {
		db.transaction(() => {
			addTx("t1", 100, "quiz_reward");
			addTx("t2", 50, "quiz_reward");
			addTx("t3", 30, "event_reward");
			addTx("t4", -20, "consume");
		})();

		const quizTotal = (
			db.prepare("SELECT SUM(delta) as total FROM drop_transactions WHERE user_id=? AND reason='quiz_reward'").get("user-1") as { total: number }
		).total;
		const eventTotal = (
			db.prepare("SELECT SUM(delta) as total FROM drop_transactions WHERE user_id=? AND reason='event_reward'").get("user-1") as { total: number }
		).total;
		const consumeTotal = (
			db.prepare("SELECT SUM(delta) as total FROM drop_transactions WHERE user_id=? AND reason='consume'").get("user-1") as { total: number }
		).total;
		expect(quizTotal).toBe(150);
		expect(eventTotal).toBe(30);
		expect(consumeTotal).toBe(-20);
	});
});
