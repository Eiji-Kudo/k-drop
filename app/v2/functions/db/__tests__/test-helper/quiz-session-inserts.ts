import type { InferInsertModel } from "drizzle-orm";
import * as schema from "../../schema/index.ts";
import { NOW } from "./constants";
import { getTestFactories, type TestDb } from "./db";

type QuizSessionInsert = Partial<InferInsertModel<typeof schema.quizSessions>>;
type QuizAnswerInsert = Partial<InferInsertModel<typeof schema.quizAnswers>>;

export async function insertQuizSession(sqliteDb: TestDb, values: QuizSessionInsert = {}) {
	const status = values.status ?? "in_progress";
	const session = await getTestFactories(sqliteDb).quizSessions.create({
		quizSessionId: values.quizSessionId ?? "session-1",
		userId: values.userId ?? "user-1",
		idolGroupId: values.idolGroupId ?? "group-1",
		status,
		totalQuestionCount: values.totalQuestionCount ?? 5,
		answeredQuestionCount: values.answeredQuestionCount ?? 0,
		correctAnswerCount: values.correctAnswerCount ?? 0,
		incorrectAnswerCount: values.incorrectAnswerCount ?? 0,
		currentQuestionOrder: "currentQuestionOrder" in values ? (values.currentQuestionOrder ?? null) : status === "in_progress" ? 1 : null,
		startedAt: values.startedAt ?? NOW,
		lastAnsweredAt: "lastAnsweredAt" in values ? (values.lastAnsweredAt ?? null) : null,
		completedAt: "completedAt" in values ? (values.completedAt ?? null) : null,
	});
	return session.quizSessionId;
}

export async function insertSessionQuestion(
	sqliteDb: TestDb,
	values: Partial<{ id: string; sessionId: string; quizId: string; order: number; createdAt: string }> = {},
) {
	const question = await getTestFactories(sqliteDb).quizSessionQuestions.create({
		quizSessionQuestionId: values.id ?? "sq-1",
		quizSessionId: values.sessionId ?? "session-1",
		quizId: values.quizId ?? "quiz-1",
		questionOrder: values.order ?? 1,
		createdAt: values.createdAt ?? NOW,
	});
	return question.quizSessionQuestionId;
}

export async function insertQuizAnswer(sqliteDb: TestDb, values: QuizAnswerInsert = {}) {
	return getTestFactories(sqliteDb).quizAnswers.create({
		quizAnswerId: values.quizAnswerId ?? "answer-1",
		quizSessionQuestionId: values.quizSessionQuestionId ?? "sq-1",
		quizChoiceId: values.quizChoiceId ?? "choice-1",
		awardedScore: values.awardedScore ?? 0,
		answeredAt: values.answeredAt ?? NOW,
	});
}
