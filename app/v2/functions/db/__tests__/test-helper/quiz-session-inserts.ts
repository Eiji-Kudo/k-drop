import type { InferInsertModel } from "drizzle-orm";
import * as schema from "../../schema/index.ts";
import {
	ensureBaseIdolGroup,
	ensureBaseQuiz,
	ensureBaseQuizChoice,
	ensureBaseQuizSession,
	ensureBaseSessionQuestion,
	ensureBaseUser,
} from "./base-fixtures";
import { getTestFactories, type TestDb } from "./db";

type QuizSessionInsert = Partial<InferInsertModel<typeof schema.quizSessions>>;
type QuizAnswerInsert = Partial<InferInsertModel<typeof schema.quizAnswers>>;

export async function insertQuizSession(sqliteDb: TestDb, values: QuizSessionInsert = {}) {
	const status = values.status ?? "in_progress";
	if (!("userId" in values)) await ensureBaseUser(sqliteDb);
	if (!("idolGroupId" in values)) await ensureBaseIdolGroup(sqliteDb);
	const session = await getTestFactories(sqliteDb).quizSessions.traits.base.create({
		...values,
		...(!("currentQuestionOrder" in values) && status !== "in_progress" ? { currentQuestionOrder: null } : {}),
	});
	return session.quizSessionId;
}

export async function insertSessionQuestion(
	sqliteDb: TestDb,
	values: Partial<{ id: string; sessionId: string; quizId: string; order: number; createdAt: string }> = {},
) {
	if (!("sessionId" in values)) await ensureBaseQuizSession(sqliteDb);
	if (!("quizId" in values)) await ensureBaseQuiz(sqliteDb);
	const question = await getTestFactories(sqliteDb).quizSessionQuestions.traits.base.create({
		...(values.id ? { quizSessionQuestionId: values.id } : {}),
		...("sessionId" in values ? { quizSessionId: values.sessionId } : {}),
		...("quizId" in values ? { quizId: values.quizId } : {}),
		...("order" in values ? { questionOrder: values.order } : {}),
		...("createdAt" in values ? { createdAt: values.createdAt } : {}),
	});
	return question.quizSessionQuestionId;
}

export async function insertQuizAnswer(sqliteDb: TestDb, values: QuizAnswerInsert = {}) {
	if (!("quizSessionQuestionId" in values)) await ensureBaseSessionQuestion(sqliteDb);
	if (!("quizChoiceId" in values)) await ensureBaseQuizChoice(sqliteDb);
	return getTestFactories(sqliteDb).quizAnswers.traits.base.create(values);
}
