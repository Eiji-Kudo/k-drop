import { ArrowRight, Flame, Sparkles, Target } from "lucide-react";
import { PrimaryCTA } from "@/components/ui/cta";
import { cn } from "@/lib/cn";

export type QuizAnswerFeedback = {
	isCorrect: boolean;
	statusLabel: string;
	headline: string;
	message: string;
	gainedScore: number;
	comboCount: number;
	remainingQuestions: number;
};

type ResultModalProps = {
	feedback: QuizAnswerFeedback;
	onRevealExplanation: () => void;
};

export function ResultModal({ feedback, onRevealExplanation }: ResultModalProps) {
	const toneClassName = feedback.isCorrect
		? {
				panel: "border-success/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(241,255,247,0.94)_100%)]",
				badge: "border-success/15 bg-success/10 text-[#0c6f32]",
				icon: "border-success/15 bg-success/10 text-[#0c6f32]",
			}
		: {
				panel: "border-error/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,243,246,0.94)_100%)]",
				badge: "border-error/12 bg-error/10 text-[#b5273a]",
				icon: "border-error/12 bg-error/10 text-[#b5273a]",
			};
	const comboLabel = feedback.comboCount > 0 ? `${feedback.comboCount} COMBO` : "NEXT 1";
	const remainingLabel = feedback.remainingQuestions === 0 ? "LAST" : `あと ${feedback.remainingQuestions}問`;

	return (
		<div
			className="fixed inset-0 z-50 flex items-end justify-center bg-[#4f2443]/18 p-4 sm:items-center"
			role="dialog"
			aria-modal="true"
			aria-label={feedback.headline}
		>
			<div className={cn("w-full max-w-[24rem] rounded-[2rem] border p-5 shadow-pop backdrop-blur-md", toneClassName.panel)}>
				<div className="space-y-5">
					<div className="flex items-start justify-between gap-3">
						<div className="space-y-2">
							<span
								className={cn(
									"inline-flex items-center gap-2 rounded-pill border px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em]",
									toneClassName.badge,
								)}
							>
								<Sparkles className="size-3.5" strokeWidth={2.2} />
								{feedback.statusLabel}
							</span>
							<div className="space-y-1">
								<p className="text-[1.85rem] font-black leading-none tracking-[-0.05em] text-base-content">{feedback.headline}</p>
								<p className="text-sm leading-6 text-muted-foreground">{feedback.message}</p>
							</div>
						</div>
						<div className={cn("flex size-12 shrink-0 items-center justify-center rounded-full border shadow-soft", toneClassName.icon)}>
							{feedback.isCorrect ? <Sparkles className="size-5" strokeWidth={2.2} /> : <Target className="size-5" strokeWidth={2.2} />}
						</div>
					</div>

					<div className="grid grid-cols-3 gap-2">
						<div className="rounded-[1.25rem] border border-white/80 bg-white/78 px-3 py-3 shadow-soft">
							<div className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.18em] text-primary">
								<Sparkles className="size-3.5" strokeWidth={2.2} />
								SCORE
							</div>
							<p className="mt-2 text-base font-black tracking-[-0.03em] text-base-content">+{feedback.gainedScore} score</p>
						</div>
						<div className="rounded-[1.25rem] border border-white/80 bg-white/78 px-3 py-3 shadow-soft">
							<div className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.18em] text-primary">
								<Flame className="size-3.5" strokeWidth={2.2} />
								COMBO
							</div>
							<p className="mt-2 text-base font-black tracking-[-0.03em] text-base-content">{comboLabel}</p>
						</div>
						<div className="rounded-[1.25rem] border border-white/80 bg-white/78 px-3 py-3 shadow-soft">
							<div className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.18em] text-primary">
								<Target className="size-3.5" strokeWidth={2.2} />
								LEFT
							</div>
							<p className="mt-2 text-base font-black tracking-[-0.03em] text-base-content">{remainingLabel}</p>
						</div>
					</div>

					<PrimaryCTA className="w-full" onClick={onRevealExplanation}>
						解説を見る
						<ArrowRight className="ml-2 size-4" strokeWidth={2.2} />
					</PrimaryCTA>
				</div>
			</div>
		</div>
	);
}
