import { Flame, Sparkles, Target } from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";
import type { HomeMotivationViewModel } from "@/lib/ux/types";

type WelcomeHeaderProps = {
	viewModel: HomeMotivationViewModel;
};

export function WelcomeHeader({ viewModel }: WelcomeHeaderProps) {
	return (
		<SectionCard tone="hero" className="relative overflow-hidden px-5 py-5 sm:px-6 sm:py-6">
			<div className="absolute right-0 top-0 size-40 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.48),transparent_72%)] blur-2xl" />
			<div className="absolute -left-10 bottom-0 size-32 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.38),transparent_72%)] blur-2xl" />

			<div className="relative flex flex-col gap-5">
				<div className="flex items-start justify-between gap-3">
					<div className="space-y-3">
						<span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/65 bg-white/45 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] text-primary shadow-soft">
							<Sparkles className="size-3.5" strokeWidth={2.2} />
							{viewModel.heroEyebrow}
						</span>
						<div className="space-y-2">
							<h1 className="text-[clamp(2rem,7vw,2.85rem)] font-black leading-none tracking-[-0.06em] text-base-content">{viewModel.heroTitle}</h1>
							<p className="max-w-[34rem] text-sm leading-6 text-base-content/76">{viewModel.heroDescription}</p>
						</div>
					</div>
					<div className="flex size-12 shrink-0 items-center justify-center rounded-[1.15rem] border border-white/55 bg-white/38 text-primary shadow-soft">
						<Flame className="size-5" strokeWidth={2.2} />
					</div>
				</div>

				<div className="grid gap-3 sm:grid-cols-[1.05fr,0.95fr]">
					<div className="rounded-[1.35rem] border border-white/60 bg-white/52 px-4 py-4 shadow-soft">
						<div className="mb-3 flex items-center gap-2 text-primary">
							<Target className="size-4" strokeWidth={2.1} />
							<p className="text-[0.68rem] font-semibold tracking-[0.18em] text-base-content/56">現在のレベル</p>
						</div>
						<div className="space-y-1">
							<p className="text-xl font-black tracking-[-0.04em] text-base-content">{viewModel.currentTierName}</p>
							<p className="text-sm font-semibold text-base-content/72">{viewModel.currentScore.toLocaleString("ja-JP")} pt</p>
						</div>
					</div>

					<div className="rounded-[1.35rem] border border-white/60 bg-white/52 px-4 py-4 shadow-soft">
						<p className="mb-3 text-[0.68rem] font-semibold tracking-[0.18em] text-base-content/56">次の狙い</p>
						<div className="space-y-1">
							<p className="text-base font-black tracking-[-0.03em] text-base-content">{viewModel.heroStatusLabel}</p>
							<p className="text-sm leading-6 text-base-content/72">{viewModel.nextTierHint}</p>
						</div>
					</div>
				</div>
			</div>
		</SectionCard>
	);
}
