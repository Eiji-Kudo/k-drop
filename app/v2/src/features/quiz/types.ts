export type Choice = {
	choice_order: number;
	choice_text: string;
	is_correct: boolean;
};

export type QuizQuestion = {
	prompt: string;
	explanation: string;
	choices: ReadonlyArray<Choice>;
};

export type QuizGroup = {
	idolGroupId: string;
	groupName: string;
	thumbnailUrl?: string;
};

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
