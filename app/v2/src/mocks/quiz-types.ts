export type QuizDifficulty = "easy" | "normal" | "hard";
export type QuizStatus = "draft" | "published" | "archived";

export type QuizChoice = {
	quizChoiceId: string;
	quizId: string;
	choiceOrder: number;
	choiceText: string;
	isCorrect: number;
};

export type Quiz = {
	quizId: string;
	idolGroupId: string;
	difficulty: QuizDifficulty;
	status: QuizStatus;
	prompt: string;
	explanation: string | null;
	publishedAt: string | null;
	createdAt: string;
	updatedAt: string;
	choices: QuizChoice[];
};
