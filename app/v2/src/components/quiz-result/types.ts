export type QuizResultEntry = {
	questionId: string;
	prompt: string;
	isCorrect: boolean;
	userAnswer: string;
	correctAnswer: string;
	explanation: string;
};

export type QuizResultData = {
	totalScore: number;
	results: Array<QuizResultEntry>;
};
