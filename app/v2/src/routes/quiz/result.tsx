import { createFileRoute, Link } from "@tanstack/react-router";
import { QuizResultItem } from "@/components/quiz-result/quiz-result-item";
import { ResultSummary } from "@/components/quiz-result/result-summary";
import { mockQuizResultData } from "@/routes/quiz/__mock__/-quiz-result-data";

function QuizResultPage() {
	const quizResultData = mockQuizResultData;
	const correctCount = quizResultData.results.filter((r) => r.isCorrect).length;

	return (
		<main className="grid flex-1 content-start gap-4">
			<h1 className="text-center text-2xl font-bold">クイズ結果</h1>

			<ResultSummary totalScore={quizResultData.totalScore} correctCount={correctCount} totalQuestions={quizResultData.results.length} />

			<section className="flex flex-col gap-4">
				<h2 className="text-lg font-bold">回答したクイズ</h2>
				{quizResultData.results.map((result) => (
					<QuizResultItem key={result.questionId} result={result} />
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
