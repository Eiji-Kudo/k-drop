import { createFileRoute, Link } from "@tanstack/react-router";
import { QuizResultItem } from "@/components/quiz-result/quiz-result-item";
import { ResultSummary } from "@/components/quiz-result/result-summary";
import type { QuizResultData } from "@/components/quiz-result/types";

const mockQuizResultData: QuizResultData = {
	totalScore: 80,
	results: [
		{
			prompt: "BLACKPINKのメンバーで、ソロ曲「LALISA」をリリースしたのは誰？",
			isCorrect: true,
			userAnswer: "リサ",
			correctAnswer: "リサ",
			explanation: "リサは2021年にソロシングル「LALISA」をリリースし、MVは公開24時間で7,360万回再生を記録しました。",
		},
		{
			prompt: "TWICEのデビュー曲はどれ？",
			isCorrect: true,
			userAnswer: "Like Ooh-Ahh",
			correctAnswer: "Like Ooh-Ahh",
			explanation: "TWICEは2015年10月に「Like Ooh-Ahh（OOH-AHH하게）」でデビューしました。",
		},
		{
			prompt: "BTSの公式ファンクラブの名前は？",
			isCorrect: false,
			userAnswer: "BLINK",
			correctAnswer: "ARMY",
			explanation: "BTSの公式ファンクラブ名は「ARMY」（Adorable Representative M.C for Youth）です。BLINKはBLACKPINKのファンクラブ名です。",
		},
		{
			prompt: "IVEのメンバー数は何人？",
			isCorrect: true,
			userAnswer: "6人",
			correctAnswer: "6人",
			explanation: "IVEは、ユジン、ガウル、レイ、ウォニョン、リズ、イソの6人で構成されています。",
		},
		{
			prompt: "Stray Kidsの所属事務所はどこ？",
			isCorrect: false,
			userAnswer: "SM Entertainment",
			correctAnswer: "JYP Entertainment",
			explanation: "Stray KidsはJYP Entertainmentに所属しています。SM EntertainmentにはNCTやaespaなどが所属しています。",
		},
	],
};

function QuizResultPage() {
	const quizResultData = mockQuizResultData;
	const correctCount = quizResultData.results.filter((r) => r.isCorrect).length;

	return (
		<main className="grid flex-1 content-start gap-4">
			<h1 className="text-center text-2xl font-bold">クイズ結果</h1>

			<ResultSummary totalScore={quizResultData.totalScore} correctCount={correctCount} totalQuestions={quizResultData.results.length} />

			<section className="flex flex-col gap-4">
				<h2 className="text-lg font-bold">回答したクイズ</h2>
				{quizResultData.results.map((result, index) => (
					<QuizResultItem key={index} result={result} />
				))}
			</section>

			<div className="pb-8 pt-4">
				<Link to="/quiz" className="btn btn-primary w-full">
					グループ一覧に戻る
				</Link>
			</div>
		</main>
	);
}

export const Route = createFileRoute("/quiz/result")({
	component: QuizResultPage,
});
