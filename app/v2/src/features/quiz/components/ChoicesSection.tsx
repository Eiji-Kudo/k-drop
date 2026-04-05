import { useCallback, useEffect, useState } from "react";
import { PrimaryCTA } from "@/components/ui/cta";
import { SectionCard } from "@/components/ui/SectionCard";
import type { Choice } from "../types";
import { type ChoiceVariant, QuizChoice } from "./QuizChoice";
import { ResultModal } from "./ResultModal";

type DisplayPhase = "question" | "result" | "explanation";

type ChoicesSectionProps = {
	choices: ReadonlyArray<Choice>;
	explanation: string;
	onNext: () => void;
};

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
					<SectionCard tone="soft" className="px-4 py-4">
						<p className="text-sm leading-6">{explanation}</p>
					</SectionCard>
					<PrimaryCTA className="w-full" onClick={handleNext}>
						次へ
					</PrimaryCTA>
				</>
			)}
		</div>
	);
}
