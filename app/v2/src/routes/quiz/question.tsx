import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { type Choice, ChoicesSection } from "@/components/quiz/ChoicesSection";
import { QuestionPrompt } from "@/components/quiz/QuestionPrompt";
import { QuizHeader } from "@/components/quiz/QuizHeader";

type QuizQuestion = {
	prompt: string;
	explanation: string;
	choices: ReadonlyArray<Choice>;
};

const MOCK_QUESTIONS: ReadonlyArray<QuizQuestion> = [
	{
		prompt: "BLACKPINKのメンバーではないのは誰？",
		explanation: "BLACKPINKはジス、ジェニ、ロゼ、リサの4人グループです。ナヨンはTWICEのメンバーです。",
		choices: [
			{ choice_order: 1, choice_text: "ジス", is_correct: false },
			{ choice_order: 2, choice_text: "ジェニ", is_correct: false },
			{ choice_order: 3, choice_text: "ナヨン", is_correct: true },
			{ choice_order: 4, choice_text: "リサ", is_correct: false },
		],
	},
	{
		prompt: "TWICEのデビュー曲はどれ？",
		explanation: "TWICEは2015年10月20日に「Like Ooh-Ahh」でデビューしました。",
		choices: [
			{ choice_order: 1, choice_text: "TT", is_correct: false },
			{ choice_order: 2, choice_text: "Like Ooh-Ahh", is_correct: true },
			{ choice_order: 3, choice_text: "CHEER UP", is_correct: false },
			{ choice_order: 4, choice_text: "What is Love?", is_correct: false },
		],
	},
	{
		prompt: "BTSのリーダーは誰？",
		explanation: "BTSのリーダーはRM（キム・ナムジュン）です。2013年のデビュー以来、グループを率いています。",
		choices: [
			{ choice_order: 1, choice_text: "ジン", is_correct: false },
			{ choice_order: 2, choice_text: "SUGA", is_correct: false },
			{ choice_order: 3, choice_text: "RM", is_correct: true },
			{ choice_order: 4, choice_text: "J-HOPE", is_correct: false },
		],
	},
	{
		prompt: "aespaのバーチャルメンバーの総称は？",
		explanation: "aespaには各メンバーに対応するバーチャルアバター「æ（アイ）」が存在します。",
		choices: [
			{ choice_order: 1, choice_text: "AI", is_correct: false },
			{ choice_order: 2, choice_text: "æ", is_correct: true },
			{ choice_order: 3, choice_text: "NAEVIS", is_correct: false },
			{ choice_order: 4, choice_text: "KWANGYA", is_correct: false },
		],
	},
	{
		prompt: "IVEの所属事務所はどこ？",
		explanation: "IVEは韓国の芸能事務所STARSHIPエンターテインメント所属のガールズグループです。",
		choices: [
			{ choice_order: 1, choice_text: "JYPエンターテインメント", is_correct: false },
			{ choice_order: 2, choice_text: "SMエンターテインメント", is_correct: false },
			{ choice_order: 3, choice_text: "HYBEレーベルズ", is_correct: false },
			{ choice_order: 4, choice_text: "STARSHIPエンターテインメント", is_correct: true },
		],
	},
];

function QuizQuestionPage() {
	const navigate = useNavigate();
	const [currentIndex, setCurrentIndex] = useState(0);

	const question = MOCK_QUESTIONS[currentIndex];

	const handleNext = useCallback(() => {
		if (currentIndex + 1 >= MOCK_QUESTIONS.length) {
			void navigate({ to: "/" });
			return;
		}
		setCurrentIndex((prev) => prev + 1);
	}, [currentIndex, navigate]);

	return (
		<main className="grid flex-1 content-start gap-8">
			<QuizHeader />
			<QuestionPrompt prompt={question.prompt} />
			<ChoicesSection key={currentIndex} choices={question.choices} explanation={question.explanation} onNext={handleNext} />
		</main>
	);
}

export const Route = createFileRoute("/quiz/question")({
	component: QuizQuestionPage,
});
