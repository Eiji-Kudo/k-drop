// @vitest-environment node
import type Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	createTestDb,
	insertGroupCategory,
	insertIdolGroup,
	insertQuiz,
	insertQuizChoice,
	insertQuizSession,
	insertScoreTier,
	insertSessionQuestion,
	insertUser,
	NOW,
	setupBaseData,
} from "./test-helper";

let db: Database.Database;
beforeEach(() => {
	db = createTestDb();
});
afterEach(() => {
	db.close();
});

describe("1:1 関係", () => {
	beforeEach(async () => await insertUser(db));

	it("users ↔ user_profiles — PK 制約で 1:1 を担保", () => {
		db.prepare("INSERT INTO user_profiles (user_id, handle, display_name, created_at, updated_at) VALUES (?,?,?,?,?)").run(
			"user-1",
			"h1",
			"U1",
			NOW,
			NOW,
		);
		expect(() =>
			db
				.prepare("INSERT INTO user_profiles (user_id, handle, display_name, created_at, updated_at) VALUES (?,?,?,?,?)")
				.run("user-1", "h2", "U1dup", NOW, NOW),
		).toThrow();
	});

	it("users ↔ drop_wallets — PK 制約で 1:1 を担保", () => {
		db.prepare("INSERT INTO drop_wallets (user_id, balance, updated_at) VALUES (?,?,?)").run("user-1", 100, NOW);
		expect(() => db.prepare("INSERT INTO drop_wallets (user_id, balance, updated_at) VALUES (?,?,?)").run("user-1", 200, NOW)).toThrow();
	});
});

describe("1:N 関係の連鎖", () => {
	beforeEach(async () => await setupBaseData(db));

	it("quiz_sessions → quiz_session_questions → quiz_answers", async () => {
		await insertQuiz(db);
		await insertQuizChoice(db, { quizChoiceId: "c1", choiceOrder: 1, isCorrect: 1 });
		await insertQuizSession(db, { answeredQuestionCount: 1, correctAnswerCount: 1, incorrectAnswerCount: 0, lastAnsweredAt: NOW });
		await insertSessionQuestion(db);
		db.prepare(
			"INSERT INTO quiz_answers (quiz_answer_id, quiz_session_question_id, quiz_choice_id, awarded_score, answered_at) VALUES (?,?,?,?,?)",
		).run("a1", "sq-1", "c1", 10, NOW);
		const row = db.prepare("SELECT * FROM quiz_answers WHERE quiz_answer_id = ?").get("a1") as Record<string, unknown>;
		expect(row.quiz_session_question_id).toBe("sq-1");
		expect(row.quiz_choice_id).toBe("c1");
	});
});

describe("多対多中間テーブル", () => {
	beforeEach(async () => await setupBaseData(db));
	const insEvent = () =>
		db
			.prepare(
				"INSERT INTO events (event_id, created_by_user_id, title, visibility, starts_at, ends_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)",
			)
			.run("ev-1", "user-1", "Ev", "public", "2025-03-01T00:00:00Z", "2025-04-01T00:00:00Z", NOW, NOW);

	it("event_groups — unique(event_id, idol_group_id)", () => {
		insEvent();
		db.prepare("INSERT INTO event_groups (event_group_id, event_id, idol_group_id, created_at) VALUES (?,?,?,?)").run("eg1", "ev-1", "group-1", NOW);
		expect(() =>
			db
				.prepare("INSERT INTO event_groups (event_group_id, event_id, idol_group_id, created_at) VALUES (?,?,?,?)")
				.run("eg2", "ev-1", "group-1", NOW),
		).toThrow();
	});

	it("event_participants — unique(event_id, user_id)", () => {
		insEvent();
		db.prepare(
			"INSERT INTO event_participants (event_participant_id, event_id, user_id, participation_status, joined_at, updated_at) VALUES (?,?,?,?,?,?)",
		).run("ep1", "ev-1", "user-1", "joined", NOW, NOW);
		expect(() =>
			db
				.prepare(
					"INSERT INTO event_participants (event_participant_id, event_id, user_id, participation_status, joined_at, updated_at) VALUES (?,?,?,?,?,?)",
				)
				.run("ep2", "ev-1", "user-1", "waitlisted", NOW, NOW),
		).toThrow();
	});
});

describe("FK 参照整合性", () => {
	it("存在しない user への FK 参照を拒否", () => {
		expect(() =>
			db
				.prepare(
					"INSERT INTO auth_identities (auth_identity_id, user_id, provider, provider_subject_id, created_at, updated_at) VALUES (?,?,?,?,?,?)",
				)
				.run("a1", "bad", "g", "s", NOW, NOW),
		).toThrow();
	});

	it("group_categories の restrict delete — 子がある場合は削除拒否", async () => {
		await insertGroupCategory(db);
		await insertIdolGroup(db);
		expect(() => db.prepare("DELETE FROM group_categories WHERE group_category_id = ?").run("cat-1")).toThrow();
	});

	it("users 削除時に auth_identities がカスケード削除", async () => {
		await insertUser(db);
		db.prepare(
			"INSERT INTO auth_identities (auth_identity_id, user_id, provider, provider_subject_id, created_at, updated_at) VALUES (?,?,?,?,?,?)",
		).run("a1", "user-1", "g", "s", NOW, NOW);
		db.prepare("DELETE FROM users WHERE user_id = ?").run("user-1");
		expect((db.prepare("SELECT count(*) as c FROM auth_identities WHERE user_id = ?").get("user-1") as { c: number }).c).toBe(0);
	});
});

describe("ON DELETE no action (削除ブロック)", () => {
	beforeEach(async () => await setupBaseData(db));

	it("quiz_answers に参照されている quiz_choices は削除できない", async () => {
		await insertQuiz(db);
		await insertQuizChoice(db, { quizChoiceId: "c1", choiceOrder: 1, isCorrect: 1 });
		await insertQuizSession(db, { answeredQuestionCount: 1, correctAnswerCount: 1, incorrectAnswerCount: 0, lastAnsweredAt: NOW });
		await insertSessionQuestion(db);
		db.prepare(
			"INSERT INTO quiz_answers (quiz_answer_id, quiz_session_question_id, quiz_choice_id, awarded_score, answered_at) VALUES (?,?,?,?,?)",
		).run("a1", "sq-1", "c1", 10, NOW);
		expect(() => db.prepare("DELETE FROM quiz_choices WHERE quiz_choice_id = ?").run("c1")).toThrow();
	});

	it("user_score_states に参照されている score_tiers は削除できない", async () => {
		await insertScoreTier(db);
		db.prepare(
			"INSERT INTO user_score_states (user_score_state_id, user_id, score_scope, idol_group_id, score_tier_id, score_total, answered_count, correct_count, updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
		).run("uss", "user-1", "overall", null, "tier-1", 0, 0, 0, NOW);
		expect(() => db.prepare("DELETE FROM score_tiers WHERE score_tier_id = ?").run("tier-1")).toThrow();
	});
});
