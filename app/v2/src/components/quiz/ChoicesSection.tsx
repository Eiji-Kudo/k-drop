import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type ChoiceVariant, QuizChoice } from "@/components/quiz/QuizChoice";
import { type QuizAnswerFeedback, ResultModal } from "@/components/quiz/ResultModal";
import { PrimaryCTA } from "@/components/ui/cta";
import { SectionCard } from "@/components/ui/SectionCard";

type DisplayPhase = "question" | "selected" | "result" | "explanation";

export type Choice = {
	choice_order: number;
	choice_text: string;
	is_correct: boolean;
};

type ChoicesSectionProps = {
	choices: ReadonlyArray<Choice>;
	explanation: string;
	questionNumber: number;
	totalQuestions: number;
	onAnswer: (selectedIndex: number) => QuizAnswerFeedback;
	onNext: () => void;
};

function getChoiceVariant(index: number, choices: ReadonlyArray<Choice>, selectedIndex: number | null, displayPhase: DisplayPhase): ChoiceVariant {
	if (selectedIndex === null) return "idle";
	if (displayPhase === "selected") return index === selectedIndex ? "selected" : "dimmed";
	const selectedChoice = choices[selectedIndex];
	if (choices[index].is_correct) return "correct";
	if (index === selectedIndex && !selectedChoice.is_correct) return "incorrect";
	return "dimmed";
}

export function ChoicesSection({ choices, explanation, questionNumber, totalQuestions, onAnswer, onNext }: ChoicesSectionProps) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const [displayPhase, setDisplayPhase] = useState<DisplayPhase>("question");
	const [feedback, setFeedback] = useState<QuizAnswerFeedback | null>(null);
	const selectionLockedRef = useRef(false);

	const handleSelect = useCallback(
		(index: number) => {
			if (selectionLockedRef.current) return;
			selectionLockedRef.current = true;
			setSelectedIndex(index);
			setFeedback(onAnswer(index));
			setDisplayPhase("selected");
		},
		[onAnswer],
	);

	useEffect(() => {
		if (displayPhase !== "selected") return;
		const timer = setTimeout(() => setDisplayPhase("result"), 220);
		return () => clearTimeout(timer);
	}, [displayPhase]);

	const handleNext = useCallback(() => {
		selectionLockedRef.current = false;
		setSelectedIndex(null);
		setDisplayPhase("question");
		setFeedback(null);
		onNext();
	}, [onNext]);

	const handleRevealExplanation = useCallback(() => {
		setDisplayPhase("explanation");
	}, []);

	const nextLabel = questionNumber === totalQuestions ? "結果を見る" : "次の問題へ";

	return (
		<div className="flex flex-col gap-4">
			{choices.map((choice, index) => (
				<QuizChoice
					key={choice.choice_order}
					index={index}
					label={choice.choice_text}
					variant={getChoiceVariant(index, choices, selectedIndex, displayPhase)}
					disabled={displayPhase !== "question"}
					onPress={() => handleSelect(index)}
				/>
			))}

			{displayPhase === "result" && feedback && <ResultModal feedback={feedback} onRevealExplanation={handleRevealExplanation} />}

			{displayPhase === "explanation" && (
				<>
					<SectionCard tone="soft" className="space-y-3 px-5 py-5">
						<div className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.18em] text-primary">
							<Sparkles className="size-3.5" strokeWidth={2.2} />
							答えのポイント
						</div>
						<p className="text-sm leading-7 text-base-content">{explanation}</p>
					</SectionCard>
					<PrimaryCTA className="w-full" onClick={handleNext}>
						{nextLabel}
					</PrimaryCTA>
				</>
			)}
		</div>
	);
}
