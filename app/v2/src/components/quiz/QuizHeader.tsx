import { SectionCard } from "@/components/ui/SectionCard";

type QuizHeaderProps = {
	groupName: string;
	currentQuestion: number;
	totalQuestions: number;
	remainingQuestions: number;
	correctCount: number;
	progressPercent: number;
};

export function QuizHeader({ groupName, currentQuestion, totalQuestions, remainingQuestions, correctCount, progressPercent }: QuizHeaderProps) {
	return (
		<SectionCard tone="hero" className="space-y-4 px-5 py-5">
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-2">
					<span className="inline-flex items-center rounded-pill border border-white/80 bg-white/75 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] text-primary shadow-soft">
						{groupName}
					</span>
					<div className="space-y-1">
						<h1 className="text-[1.95rem] font-black leading-none tracking-[-0.05em] text-base-content">問題を解く</h1>
						<p className="text-sm leading-6 text-muted-foreground">今いる位置を見失わず、そのままテンポよく進めよう。</p>
					</div>
				</div>
				<div className="rounded-[1.35rem] border border-white/80 bg-white/75 px-4 py-3 text-right shadow-soft">
					<p className="text-[0.68rem] font-semibold tracking-[0.18em] text-primary">QUESTION</p>
					<p className="mt-1 text-2xl font-black tracking-[-0.04em] text-base-content">{currentQuestion}</p>
					<p className="text-xs text-muted-foreground">/ {totalQuestions}</p>
				</div>
			</div>

			<div className="space-y-2">
				<div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
					<span>
						進行 {currentQuestion} / {totalQuestions}
					</span>
					<span>{remainingQuestions === 0 ? "ラスト" : `あと ${remainingQuestions}問`}</span>
				</div>
				<div
					className="h-2 overflow-hidden rounded-pill bg-white/70"
					role="progressbar"
					aria-label="セッション進捗"
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={progressPercent}
				>
					<div className="h-full rounded-pill bg-[linear-gradient(135deg,#ff91c0,#ffbfd8)]" style={{ width: `${progressPercent}%` }} />
				</div>
			</div>

			<div className="grid grid-cols-3 gap-2">
				<div className="rounded-[1.25rem] border border-white/80 bg-white/72 px-3 py-3 shadow-soft">
					<p className="text-[0.68rem] font-semibold tracking-[0.18em] text-primary">進行</p>
					<p className="mt-1 text-base font-black tracking-[-0.03em] text-base-content">
						{currentQuestion} / {totalQuestions}
					</p>
				</div>
				<div className="rounded-[1.25rem] border border-white/80 bg-white/72 px-3 py-3 shadow-soft">
					<p className="text-[0.68rem] font-semibold tracking-[0.18em] text-primary">残り</p>
					<p className="mt-1 text-base font-black tracking-[-0.03em] text-base-content">
						{remainingQuestions === 0 ? "ラスト" : `${remainingQuestions}問`}
					</p>
				</div>
				<div className="rounded-[1.25rem] border border-white/80 bg-white/72 px-3 py-3 shadow-soft">
					<p className="text-[0.68rem] font-semibold tracking-[0.18em] text-primary">正解</p>
					<p className="mt-1 text-base font-black tracking-[-0.03em] text-base-content">{correctCount}問</p>
				</div>
			</div>
		</SectionCard>
	);
}
