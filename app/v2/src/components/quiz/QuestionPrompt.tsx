import { SectionCard } from "@/components/ui/SectionCard";

type QuestionPromptProps = {
	prompt: string;
	currentQuestion: number;
	totalQuestions: number;
};

export function QuestionPrompt({ prompt, currentQuestion, totalQuestions }: QuestionPromptProps) {
	return (
		<SectionCard className="space-y-4 px-5 py-5">
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-1">
					<p className="text-[0.68rem] font-semibold tracking-[0.2em] text-primary">QUESTION {currentQuestion}</p>
					<p className="text-sm leading-6 text-muted-foreground">一番しっくりくる答えをひとつ選ぼう。</p>
				</div>
				<span className="inline-flex items-center rounded-pill border border-border-soft bg-white/80 px-3 py-1 text-xs font-semibold text-base-content shadow-soft">
					{currentQuestion} / {totalQuestions}
				</span>
			</div>
			<p className="text-xl font-black leading-8 tracking-[-0.03em] text-base-content">{prompt}</p>
		</SectionCard>
	);
}
