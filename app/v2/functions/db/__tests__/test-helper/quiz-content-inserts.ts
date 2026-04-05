import type { InferInsertModel } from "drizzle-orm";
import * as schema from "../../schema/index.ts";
import { NOW } from "./constants";
import { getTestFactories, type TestDb } from "./db";
import { isQuizDifficulty, isQuizStatus } from "./types";

type QuizInsert = Omit<Partial<InferInsertModel<typeof schema.quizzes>>, "difficulty" | "status"> & { difficulty?: string; status?: string };
type QuizChoiceInsert = Partial<InferInsertModel<typeof schema.quizChoices>>;

const insertQuizWithRawEnums = (
	sqliteDb: TestDb,
	values: Required<Pick<QuizInsert, "quizId" | "idolGroupId" | "difficulty" | "status" | "prompt" | "createdAt" | "updatedAt">> &
		Pick<QuizInsert, "explanation" | "publishedAt">,
) => {
	sqliteDb
		.prepare(
			"INSERT INTO quizzes (quiz_id, idol_group_id, difficulty, status, prompt, explanation, published_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
		)
		.run(
			values.quizId,
			values.idolGroupId,
			values.difficulty,
			values.status,
			values.prompt,
			values.explanation ?? null,
			values.publishedAt ?? null,
			values.createdAt,
			values.updatedAt,
		);
	return values.quizId;
};

export async function insertQuiz(sqliteDb: TestDb, values: QuizInsert = {}) {
	const quizId = values.quizId ?? "quiz-1";
	const idolGroupId = values.idolGroupId ?? "group-1";
	const difficulty = values.difficulty ?? "easy";
	const status = values.status ?? "published";
	const prompt = values.prompt ?? "What is ...?";
	const createdAt = values.createdAt ?? NOW;
	const updatedAt = values.updatedAt ?? NOW;
	if (!isQuizDifficulty(difficulty) || !isQuizStatus(status)) {
		return insertQuizWithRawEnums(sqliteDb, {
			quizId,
			idolGroupId,
			difficulty,
			status,
			prompt,
			explanation: values.explanation,
			publishedAt: values.publishedAt,
			createdAt,
			updatedAt,
		});
	}
	const quiz = await getTestFactories(sqliteDb).quizzes.create({
		quizId,
		idolGroupId,
		difficulty,
		status,
		prompt,
		explanation: values.explanation ?? null,
		publishedAt: values.publishedAt ?? null,
		createdAt,
		updatedAt,
	});
	return quiz.quizId;
}

export async function insertQuizChoice(sqliteDb: TestDb, values: QuizChoiceInsert = {}) {
	const choice = await getTestFactories(sqliteDb).quizChoices.create({
		quizChoiceId: values.quizChoiceId ?? "choice-1",
		quizId: values.quizId ?? "quiz-1",
		choiceOrder: values.choiceOrder ?? 1,
		choiceText: values.choiceText ?? "Choice text",
		isCorrect: values.isCorrect ?? 0,
	});
	return choice.quizChoiceId;
}
