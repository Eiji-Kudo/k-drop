type ResultSummaryProps = {
	totalScore: number;
	correctCount: number;
	totalQuestions: number;
};

export function ResultSummary({ totalScore, correctCount, totalQuestions }: ResultSummaryProps) {
	return (
		<div className="card border border-base-300 bg-base-100 shadow-lg">
			<div className="card-body items-center gap-2">
				<p className="text-2xl font-bold">スコア: {totalScore}点</p>
				<p className="text-base">
					{totalQuestions}問中{correctCount}問正解
				</p>
			</div>
		</div>
	);
}
