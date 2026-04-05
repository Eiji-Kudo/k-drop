import { SectionCard } from "@/components/ui/SectionCard";
import type { QuizResultEntry } from "../types";

export function QuizResultItem({ result }: { result: QuizResultEntry }) {
	return (
		<SectionCard className="gap-3 px-4 py-4">
			<p className="font-black leading-7 tracking-[-0.02em] text-base-content">{result.prompt}</p>
			<div className="flex flex-col gap-1">
				<p className={`font-bold ${result.isCorrect ? "text-success" : "text-error"}`}>{result.isCorrect ? "正解" : "不正解"}</p>
				<p className="text-sm text-base-content/72">あなたの回答: {result.userAnswer}</p>
				{!result.isCorrect && <p className="text-sm text-success">正解: {result.correctAnswer}</p>}
			</div>
			<div className="rounded-[1.25rem] bg-surface-soft p-3">
				<p className="text-sm italic text-base-content/76">{result.explanation}</p>
			</div>
		</SectionCard>
	);
}
