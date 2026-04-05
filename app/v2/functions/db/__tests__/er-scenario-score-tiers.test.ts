// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTestDb, insertScoreTier, NOW, setupBaseData } from "./test-helper";

let db: Database.Database;
beforeEach(async () => {
	db = createTestDb();
	await setupBaseData(db);
});
afterEach(() => {
	db.close();
});

const insOverallTiers = async () => {
	await insertScoreTier(db, { scoreTierId: "t-bronze", tierScope: "overall", tierName: "Bronze", minScore: 0, maxScore: 99 });
	await insertScoreTier(db, { scoreTierId: "t-silver", tierScope: "overall", tierName: "Silver", minScore: 100, maxScore: 299 });
	await insertScoreTier(db, { scoreTierId: "t-gold", tierScope: "overall", tierName: "Gold", minScore: 300, maxScore: 999 });
};
const insState = (id: string, tierId: string, score: number, answered: number, correct: number) =>
	db
		.prepare(
			"INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, last_answered_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
		)
		.run(id, "user-1", "overall", null, tierId, score, answered, correct, NOW, NOW);

describe("スコアティアの段階的な昇格", () => {
	beforeEach(async () => await insOverallTiers());

	it("Bronze → Silver → Gold とティアが上がる", () => {
		insState("uss", "t-bronze", 50, 5, 3);
		db.prepare(
			"UPDATE user_score_states SET score_total=150, answered_count=15, correct_count=10, score_tier_id='t-silver', updated_at=? WHERE user_score_state_id=?",
		).run(NOW, "uss");
		expect(
			(db.prepare("SELECT score_tier_id FROM user_score_states WHERE user_score_state_id=?").get("uss") as { score_tier_id: string }).score_tier_id,
		).toBe("t-silver");

		db.prepare(
			"UPDATE user_score_states SET score_total=350, answered_count=35, correct_count=25, score_tier_id='t-gold', updated_at=? WHERE user_score_state_id=?",
		).run(NOW, "uss");
		expect(
			(db.prepare("SELECT score_tier_id FROM user_score_states WHERE user_score_state_id=?").get("uss") as { score_tier_id: string }).score_tier_id,
		).toBe("t-gold");
	});

	it("ティアの境界値でちょうど次のティアに昇格", () => {
		insState("uss", "t-bronze", 99, 10, 7);
		db.prepare(
			"UPDATE user_score_states SET score_total=100, answered_count=11, correct_count=8, score_tier_id='t-silver', updated_at=? WHERE user_score_state_id=?",
		).run(NOW, "uss");
		const s = db.prepare("SELECT score_total, score_tier_id FROM user_score_states WHERE user_score_state_id=?").get("uss") as Record<
			string,
			unknown
		>;
		expect(s.score_total).toBe(100);
		expect(s.score_tier_id).toBe("t-silver");
	});
});

describe("overall と group で別々のティア体系", () => {
	it("overall は Bronze だが group では Gold というケース", async () => {
		await insOverallTiers();
		await insertScoreTier(db, { scoreTierId: "tg-gold", tierScope: "group", tierName: "Gold", minScore: 50, maxScore: 999 });
		insState("ov", "t-bronze", 30, 3, 2);
		db.prepare(
			"INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, last_answered_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
		).run("gr", "user-1", "group", "group-1", "tg-gold", 80, 8, 6, NOW, NOW);
		const ov = db.prepare("SELECT score_tier_id FROM user_score_states WHERE user_score_state_id=?").get("ov") as { score_tier_id: string };
		const gr = db.prepare("SELECT score_tier_id FROM user_score_states WHERE user_score_state_id=?").get("gr") as { score_tier_id: string };
		expect(ov.score_tier_id).toBe("t-bronze");
		expect(gr.score_tier_id).toBe("tg-gold");
	});
});

describe("複数セッションにわたるスコア蓄積", () => {
	it("3 回のセッション完了で累積スコアが正しく加算される", async () => {
		await insOverallTiers();
		insState("ov", "t-bronze", 0, 0, 0);

		const addScore = (score: number, answered: number, correct: number) => {
			db.prepare(
				"UPDATE user_score_states SET score_total=score_total+?, answered_count=answered_count+?, correct_count=correct_count+?, last_answered_at=?, updated_at=? WHERE user_score_state_id=?",
			).run(score, answered, correct, NOW, NOW, "ov");
		};
		addScore(30, 5, 3);
		addScore(50, 5, 4);
		addScore(40, 5, 3);

		const s = db.prepare("SELECT score_total, answered_count, correct_count FROM user_score_states WHERE user_score_state_id=?").get("ov") as Record<
			string,
			number
		>;
		expect(s.score_total).toBe(120);
		expect(s.answered_count).toBe(15);
		expect(s.correct_count).toBe(10);
	});
});
