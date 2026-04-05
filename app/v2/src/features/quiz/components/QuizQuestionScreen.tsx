import { useCallback, useState } from "react";
import { MOCK_QUESTIONS } from "../mock/quiz-questions";
import { ChoicesSection } from "./ChoicesSection";
import { QuestionPrompt } from "./QuestionPrompt";
import { QuizHeader } from "./QuizHeader";

type QuizQuestionScreenProps = {
	onComplete: () => void;
};

export function QuizQuestionScreen({ onComplete }: QuizQuestionScreenProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	const question = MOCK_QUESTIONS[currentIndex];

	const handleNext = useCallback(() => {
		if (currentIndex + 1 >= MOCK_QUESTIONS.length) {
			onComplete();
			return;
		}
		setCurrentIndex((prev) => prev + 1);
	}, [currentIndex, onComplete]);

	return (
		<main className="grid flex-1 content-start gap-8">
			<QuizHeader />
			<QuestionPrompt prompt={question.prompt} />
			<ChoicesSection key={currentIndex} choices={question.choices} explanation={question.explanation} onNext={handleNext} />
		</main>
	);
}
