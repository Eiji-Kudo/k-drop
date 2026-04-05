// @vitest-environment node
import { describe, expect, it } from "vitest";
import migrationSql from "../../migrations/0000_woozy_taskmaster.sql?raw";
import {
	applyQuizAnswerProgress,
	hasExactlyOneCorrectChoice,
	isQuizChoiceCompatibleWithQuestion,
	isScopeAndGroupConsistent,
	matchesSessionQuestionCount,
} from "../er-diagram-rules.ts";

describe("ER diagram migration constraints", () => {
	it("includes core unique constraints for identity and relation tables", () => {
		expect(migrationSql).toContain("CREATE UNIQUE INDEX `auth_identities_provider_provider_subject_id_unique` ON `auth_identities` (`provider`,`provider_subject_id`)");
		expect(migrationSql).toContain("CREATE UNIQUE INDEX `user_favorite_groups_user_id_idol_group_id_unique` ON `user_favorite_groups` (`user_id`,`idol_group_id`)");
		expect(migrationSql).toContain("CREATE UNIQUE INDEX `quiz_session_questions_quiz_session_id_quiz_id_unique` ON `quiz_session_questions` (`quiz_session_id`,`quiz_id`)");
		expect(migrationSql).toContain("CREATE UNIQUE INDEX `quiz_answers_quiz_session_question_id_unique` ON `quiz_answers` (`quiz_session_question_id`)");
	});

	it("includes core business-rule checks for events, drops, and score scope", () => {
		expect(migrationSql).toContain('CONSTRAINT "events_dates_check" CHECK("events"."ends_at" >= "events"."starts_at")');
		expect(migrationSql).toContain('CONSTRAINT "drop_transactions_delta_nonzero" CHECK("drop_transactions"."delta" <> 0)');
		expect(migrationSql).toContain('CONSTRAINT "user_score_states_scope_group_match" CHECK(("user_score_states"."score_scope" = \'overall\' AND "user_score_states"."idol_group_id" IS NULL) OR ("user_score_states"."score_scope" = \'group\' AND "user_score_states"."idol_group_id" IS NOT NULL))');
	});

	it("includes partial unique indexes for in-progress sessions and scope tables", () => {
		expect(migrationSql).toContain("CREATE UNIQUE INDEX `quiz_sessions_in_progress_per_user_group` ON `quiz_sessions` (`user_id`,`idol_group_id`) WHERE \"quiz_sessions\".\"status\" = 'in_progress'");
		expect(migrationSql).toContain("CREATE UNIQUE INDEX `user_score_states_overall_scope` ON `user_score_states` (`user_id`,`score_scope`) WHERE \"user_score_states\".\"idol_group_id\" IS NULL");
		expect(migrationSql).toContain("CREATE UNIQUE INDEX `user_score_states_group_scope` ON `user_score_states` (`user_id`,`score_scope`,`idol_group_id`) WHERE \"user_score_states\".\"idol_group_id\" IS NOT NULL");
	});
});

describe("ER diagram application-level invariants", () => {
	it("validates one and only one correct choice per quiz", () => {
		expect(hasExactlyOneCorrectChoice([{ isCorrect: true }, { isCorrect: false }, { isCorrect: false }])).toBe(true);
		expect(hasExactlyOneCorrectChoice([{ isCorrect: true }, { isCorrect: true }, { isCorrect: false }])).toBe(false);
		expect(hasExactlyOneCorrectChoice([{ isCorrect: false }, { isCorrect: false }])).toBe(false);
	});

	it("validates that answer choice belongs to the asked quiz", () => {
		expect(isQuizChoiceCompatibleWithQuestion({ questionQuizId: "quiz_1", selectedChoiceQuizId: "quiz_1" })).toBe(true);
		expect(isQuizChoiceCompatibleWithQuestion({ questionQuizId: "quiz_1", selectedChoiceQuizId: "quiz_2" })).toBe(false);
	});

	it("validates session question-count consistency", () => {
		expect(matchesSessionQuestionCount({ totalQuestionCount: 10, actualQuestionCount: 10 })).toBe(true);
		expect(matchesSessionQuestionCount({ totalQuestionCount: 10, actualQuestionCount: 9 })).toBe(false);
	});

	it("validates scope and idol_group_id consistency", () => {
		expect(isScopeAndGroupConsistent({ scoreScope: "overall", idolGroupId: null })).toBe(true);
		expect(isScopeAndGroupConsistent({ scoreScope: "group", idolGroupId: "group_1" })).toBe(true);
		expect(isScopeAndGroupConsistent({ scoreScope: "overall", idolGroupId: "group_1" })).toBe(false);
		expect(isScopeAndGroupConsistent({ scoreScope: "group", idolGroupId: null })).toBe(false);
	});

	it("updates quiz session progress and completes session on last answer", () => {
		const inProgress = applyQuizAnswerProgress({
			current: {
				status: "in_progress",
				totalQuestionCount: 3,
				answeredQuestionCount: 1,
				correctAnswerCount: 1,
				incorrectAnswerCount: 0,
				currentQuestionOrder: 2,
				lastAnsweredAt: "2026-04-05T10:00:00.000Z",
				completedAt: null,
			},
			isCorrect: false,
			answeredAt: "2026-04-05T10:01:00.000Z",
		});

		expect(inProgress).toEqual({
			status: "in_progress",
			totalQuestionCount: 3,
			answeredQuestionCount: 2,
			correctAnswerCount: 1,
			incorrectAnswerCount: 1,
			currentQuestionOrder: 3,
			lastAnsweredAt: "2026-04-05T10:01:00.000Z",
			completedAt: null,
		});

		const completed = applyQuizAnswerProgress({
			current: inProgress,
			isCorrect: true,
			answeredAt: "2026-04-05T10:02:00.000Z",
		});

		expect(completed).toEqual({
			status: "completed",
			totalQuestionCount: 3,
			answeredQuestionCount: 3,
			correctAnswerCount: 2,
			incorrectAnswerCount: 1,
			currentQuestionOrder: null,
			lastAnsweredAt: "2026-04-05T10:02:00.000Z",
			completedAt: "2026-04-05T10:02:00.000Z",
		});
	});
});
