import { useCallback, useEffect, useState } from "react";
import { QuizChoice } from "@/components/quiz/QuizChoice";
import { ResultModal } from "@/components/quiz/ResultModal";

type DisplayPhase = "question" | "result" | "explanation";

type Choice = {
	choice_order: number;
	choice_text: string;
	is_correct: boolean;
};

type ChoicesSectionProps = {
	choices: ReadonlyArray<Choice>;
	explanation: string;
	onNext: () => void;
};

type ChoiceVariant = "unanswered" | "correct" | "incorrect";

function getChoiceVariant(index: number, choices: ReadonlyArray<Choice>, selectedIndex: number | null): ChoiceVariant {
	if (selectedIndex === null) return "unanswered";
	const choice = choices[index];
	if (choice.is_correct) return "correct";
	if (index === selectedIndex) return "incorrect";
	return "unanswered";
}

export function ChoicesSection({ choices, explanation, onNext }: ChoicesSectionProps) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const [displayPhase, setDisplayPhase] = useState<DisplayPhase>("question");

	const isCorrect = selectedIndex !== null ? choices[selectedIndex].is_correct : null;

	const handleSelect = useCallback(
		(index: number) => {
			if (selectedIndex !== null) return;
			setSelectedIndex(index);
			setDisplayPhase("result");
		},
		[selectedIndex],
	);

	useEffect(() => {
		if (displayPhase !== "result") return;
		const timer = setTimeout(() => setDisplayPhase("explanation"), 600);
		return () => clearTimeout(timer);
	}, [displayPhase]);

	const handleNext = useCallback(() => {
		setSelectedIndex(null);
		setDisplayPhase("question");
		onNext();
	}, [onNext]);

	return (
		<div className="flex flex-col gap-4">
			{choices.map((choice, index) => (
				<QuizChoice
					key={choice.choice_order}
					index={index}
					label={choice.choice_text}
					variant={getChoiceVariant(index, choices, selectedIndex)}
					disabled={selectedIndex !== null}
					onPress={() => handleSelect(index)}
				/>
			))}

			{displayPhase === "result" && isCorrect !== null && <ResultModal isCorrect={isCorrect} />}

			{displayPhase === "explanation" && (
				<>
					<div className="rounded-lg bg-base-200 p-4">
						<p className="text-sm leading-6">{explanation}</p>
					</div>
					<button type="button" className="btn btn-primary w-full" onClick={handleNext}>
						次へ
					</button>
				</>
			)}
		</div>
	);
}
