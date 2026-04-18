import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, TimerReset } from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";
import type { HomeMotivationViewModel } from "@/lib/ux/types";

type HomePrimaryActionCardProps = {
	viewModel: HomeMotivationViewModel;
};

export function HomePrimaryActionCard({ viewModel }: HomePrimaryActionCardProps) {
	return (
		<Link
			to="/quiz"
			className="group block rounded-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
		>
			<SectionCard
				tone="hero"
				className="relative overflow-hidden border-white/80 px-5 py-5 transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-pop sm:px-6"
			>
				<div className="absolute inset-y-0 right-0 w-28 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.34),transparent_72%)]" />

				<div className="relative flex flex-col gap-4">
					<div className="flex items-start justify-between gap-3">
						<div className="space-y-3">
							<span className="inline-flex w-fit items-center rounded-full border border-white/65 bg-white/48 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.18em] text-primary shadow-soft">
								おすすめ
							</span>
							<div className="space-y-1">
								<h2 className="text-[1.75rem] font-black tracking-[-0.05em] text-base-content">{viewModel.primaryCtaLabel}</h2>
								<p className="text-sm leading-6 text-base-content/76">{viewModel.primaryCtaHint}</p>
							</div>
						</div>
						<div className="flex size-12 shrink-0 items-center justify-center rounded-[1.15rem] border border-white/55 bg-white/38 text-primary shadow-soft">
							<Sparkles className="size-5" strokeWidth={2.2} />
						</div>
					</div>

					<div className="flex flex-wrap gap-2">
						<div className="inline-flex items-center gap-2 rounded-pill border border-white/65 bg-white/55 px-3 py-1.5 text-sm font-semibold text-base-content shadow-soft">
							<TimerReset className="size-4 text-primary" strokeWidth={2.1} />
							最短3分
						</div>
						<div className="inline-flex items-center rounded-pill border border-white/65 bg-white/55 px-3 py-1.5 text-sm font-semibold text-base-content shadow-soft">
							{viewModel.primaryCtaSupportLabel}
						</div>
					</div>

					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold text-base-content/72">今日の 1 プレイでスコアを前に進めよう。</p>
						<div className="inline-flex items-center gap-2 rounded-pill bg-white px-4 py-2 text-sm font-semibold text-primary shadow-soft transition duration-200 group-hover:translate-x-0.5">
							今すぐ挑戦
							<ArrowRight className="size-4" strokeWidth={2.2} />
						</div>
					</div>
				</div>
			</SectionCard>
		</Link>
	);
}
