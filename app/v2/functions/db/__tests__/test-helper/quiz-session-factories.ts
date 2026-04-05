import { defineFactory } from "@praha/drizzle-factory";
import * as schema from "../../schema/index.ts";
import { usersFactory } from "./auth-factories";
import { NOW } from "./constants";
import { idolGroupsFactory } from "./group-factories";
import { quizChoicesFactory, quizzesFactory } from "./quiz-content-factories";

export const quizSessionsFactory = defineFactory({
	schema,
	table: "quizSessions",
	resolver: ({ sequence, use: related }) => ({
		quizSessionId: `session-${sequence}`,
		userId: () =>
			related(usersFactory)
				.create()
				.then((user) => user.userId),
		idolGroupId: () =>
			related(idolGroupsFactory)
				.create()
				.then((group) => group.idolGroupId),
		status: "in_progress",
		totalQuestionCount: 5,
		answeredQuestionCount: 0,
		correctAnswerCount: 0,
		incorrectAnswerCount: 0,
		currentQuestionOrder: 1,
		startedAt: NOW,
		lastAnsweredAt: null,
		completedAt: null,
	}),
});

export const quizSessionQuestionsFactory = defineFactory({
	schema,
	table: "quizSessionQuestions",
	resolver: ({ sequence, use: related }) => ({
		quizSessionQuestionId: `sq-${sequence}`,
		quizSessionId: () =>
			related(quizSessionsFactory)
				.create()
				.then((session) => session.quizSessionId),
		quizId: () =>
			related(quizzesFactory)
				.create()
				.then((quiz) => quiz.quizId),
		questionOrder: sequence,
		createdAt: NOW,
	}),
});

export const quizAnswersFactory = defineFactory({
	schema,
	table: "quizAnswers",
	resolver: ({ sequence, use: related }) => ({
		quizAnswerId: `answer-${sequence}`,
		quizSessionQuestionId: () =>
			related(quizSessionQuestionsFactory)
				.create()
				.then((question) => question.quizSessionQuestionId),
		quizChoiceId: () =>
			related(quizChoicesFactory)
				.create()
				.then((choice) => choice.quizChoiceId),
		awardedScore: 0,
		answeredAt: NOW,
	}),
});
