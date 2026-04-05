import type { QuizResultEntry } from "../types";

export function QuizResultItem({ result }: { result: QuizResultEntry }) {
	return (
		<div className="card border border-base-300 bg-base-100 shadow-md">
			<div className="card-body gap-3">
				<p className="font-bold">{result.prompt}</p>
				<div className="flex flex-col gap-1">
					<p className={`font-bold ${result.isCorrect ? "text-success" : "text-error"}`}>{result.isCorrect ? "正解" : "不正解"}</p>
					<p className="text-sm">あなたの回答: {result.userAnswer}</p>
					{!result.isCorrect && <p className="text-sm text-success">正解: {result.correctAnswer}</p>}
				</div>
				<div className="rounded-box bg-base-200 p-3">
					<p className="text-sm italic">{result.explanation}</p>
				</div>
			</div>
		</div>
	);
}
