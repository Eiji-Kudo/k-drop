export type ScoreScope = "overall" | "group";

export const hasExactlyOneCorrectChoice = (choices: readonly { isCorrect: boolean }[]): boolean => choices.filter((choice) => choice.isCorrect).length === 1;

export const isQuizChoiceCompatibleWithQuestion = (input: { questionQuizId: string; selectedChoiceQuizId: string }): boolean =>
	input.questionQuizId === input.selectedChoiceQuizId;

export const matchesSessionQuestionCount = (input: { totalQuestionCount: number; actualQuestionCount: number }): boolean =>
	input.totalQuestionCount === input.actualQuestionCount;

export const isScopeAndGroupConsistent = (input: { scoreScope: ScoreScope; idolGroupId: string | null }): boolean =>
	(input.scoreScope === "overall" && input.idolGroupId === null) || (input.scoreScope === "group" && input.idolGroupId !== null);

export type QuizSessionProgress = {
	status: "in_progress" | "completed";
	totalQuestionCount: number;
	answeredQuestionCount: number;
	correctAnswerCount: number;
	incorrectAnswerCount: number;
	currentQuestionOrder: number | null;
	lastAnsweredAt: string | null;
	completedAt: string | null;
};

export const applyQuizAnswerProgress = (input: { current: QuizSessionProgress; isCorrect: boolean; answeredAt: string }): QuizSessionProgress => {
	const answeredQuestionCount = input.current.answeredQuestionCount + 1;
	const correctAnswerCount = input.current.correctAnswerCount + (input.isCorrect ? 1 : 0);
	const incorrectAnswerCount = input.current.incorrectAnswerCount + (input.isCorrect ? 0 : 1);
	const isCompleted = answeredQuestionCount >= input.current.totalQuestionCount;

	return {
		...input.current,
		status: isCompleted ? "completed" : "in_progress",
		answeredQuestionCount,
		correctAnswerCount,
		incorrectAnswerCount,
		currentQuestionOrder: isCompleted ? null : answeredQuestionCount + 1,
		lastAnsweredAt: input.answeredAt,
		completedAt: isCompleted ? input.answeredAt : null,
	};
};
