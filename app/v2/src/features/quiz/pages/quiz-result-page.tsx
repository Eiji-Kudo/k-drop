import { Link } from "@tanstack/react-router";
import { primaryCTAClassName } from "@/components/ui/cta-class-names";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { SectionCard } from "@/components/ui/SectionCard";
import { QuizResultItem } from "../components/QuizResultItem";
import { ResultSummary } from "../components/ResultSummary";
import { mockQuizResultData } from "../mock/quiz-result-data";

export function QuizResultPage() {
	const quizResultData = mockQuizResultData;
	const correctCount = quizResultData.results.filter((result) => result.isCorrect).length;

	return (
		<PageShell className="gap-4">
			<PageHeader eyebrow="RESULT" title="クイズ結果" description="今回の結果を見ながら、次の挑戦にすぐ戻れる土台にする。" />

			<ResultSummary totalScore={quizResultData.totalScore} correctCount={correctCount} totalQuestions={quizResultData.results.length} />

			<SectionCard className="flex flex-col gap-4">
				<h2 className="text-lg font-black tracking-[-0.03em] text-base-content">回答したクイズ</h2>
				{quizResultData.results.map((result) => (
					<QuizResultItem key={result.questionId} result={result} />
				))}
			</SectionCard>

			<div className="pb-8 pt-2">
				<Link to="/quiz" className={`${primaryCTAClassName} w-full`}>
					グループ一覧に戻る
				</Link>
			</div>
		</PageShell>
	);
}
