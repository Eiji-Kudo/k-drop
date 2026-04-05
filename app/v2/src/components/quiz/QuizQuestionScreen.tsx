import { useCallback, useState } from "react";
import { ChoicesSection } from "@/components/quiz/ChoicesSection";
import { MOCK_QUESTIONS } from "@/components/quiz/mock-questions";
import { QuestionPrompt } from "@/components/quiz/QuestionPrompt";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { type QuizAnswerFeedback } from "@/components/quiz/ResultModal";
import { PageShell } from "@/components/ui/PageShell";

type QuizQuestionScreenProps = {
	groupName: string;
	onComplete: () => void;
};

export function QuizQuestionScreen({ groupName, onComplete }: QuizQuestionScreenProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [correctCount, setCorrectCount] = useState(0);
	const [comboCount, setComboCount] = useState(0);

	const question = MOCK_QUESTIONS[currentIndex];
	const totalQuestions = MOCK_QUESTIONS.length;
	const currentQuestion = currentIndex + 1;
	const remainingQuestions = totalQuestions - currentQuestion;
	const progressPercent = Math.round((currentQuestion / totalQuestions) * 100);

	const handleAnswer = useCallback(
		(selectedIndex: number): QuizAnswerFeedback => {
			const isCorrect = question.choices[selectedIndex]?.is_correct ?? false;
			const nextCombo = isCorrect ? comboCount + 1 : 0;
			const gainedScore = isCorrect ? 120 + comboCount * 30 : 30;

			if (isCorrect) {
				setCorrectCount((prev) => prev + 1);
			}
			setComboCount(nextCombo);

			return isCorrect
				? {
						isCorrect: true,
						statusLabel: nextCombo >= 2 ? "HOT STREAK" : "NICE HIT",
						headline: "正解",
						message:
							nextCombo >= 2
								? `+${gainedScore} score。${nextCombo}コンボで、そのまま流れに乗れている。`
								: `+${gainedScore} score。いい入りで、次の1問にもつなげやすい。`,
						gainedScore,
						comboCount: nextCombo,
						remainingQuestions,
					}
				: {
						isCorrect: false,
						statusLabel: "KEEP GOING",
						headline: "次で取り返せる",
						message: `+${gainedScore} score。解説で押さえたら、次の1問からまた流れを作れる。`,
						gainedScore,
						comboCount: nextCombo,
						remainingQuestions,
					};
		},
		[comboCount, question.choices, remainingQuestions],
	);

	const handleNext = useCallback(() => {
		if (currentQuestion >= totalQuestions) {
			onComplete();
			return;
		}
		setCurrentIndex((prev) => prev + 1);
	}, [currentQuestion, onComplete, totalQuestions]);

	return (
		<PageShell className="gap-6">
			<QuizHeader
				groupName={groupName}
				currentQuestion={currentQuestion}
				totalQuestions={totalQuestions}
				remainingQuestions={remainingQuestions}
				correctCount={correctCount}
				progressPercent={progressPercent}
			/>
			<QuestionPrompt prompt={question.prompt} currentQuestion={currentQuestion} totalQuestions={totalQuestions} />
			<ChoicesSection
				key={currentIndex}
				choices={question.choices}
				explanation={question.explanation}
				questionNumber={currentQuestion}
				totalQuestions={totalQuestions}
				onAnswer={handleAnswer}
				onNext={handleNext}
			/>
		</PageShell>
	);
}
