import { SectionCard } from "@/components/ui/SectionCard";

type ResultSummaryProps = {
	totalScore: number;
	correctCount: number;
	totalQuestions: number;
};

export function ResultSummary({ totalScore, correctCount, totalQuestions }: ResultSummaryProps) {
	return (
		<SectionCard tone="hero" className="items-center gap-2 text-center">
			<p className="text-[2rem] font-black tracking-[-0.05em] text-base-content">スコア: {totalScore}点</p>
			<p className="text-base text-base-content/75">
				{totalQuestions}問中{correctCount}問正解
			</p>
		</SectionCard>
	);
}
