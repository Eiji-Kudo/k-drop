import { useCallback, useState } from "react";
import { ChoicesSection } from "@/components/quiz/ChoicesSection";
import { MOCK_QUESTIONS } from "@/components/quiz/mock-questions";
import { QuestionPrompt } from "@/components/quiz/QuestionPrompt";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { PageShell } from "@/components/ui/PageShell";

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
		<PageShell className="gap-6">
			<QuizHeader />
			<QuestionPrompt prompt={question.prompt} />
			<ChoicesSection key={currentIndex} choices={question.choices} explanation={question.explanation} onNext={handleNext} />
		</PageShell>
	);
}
