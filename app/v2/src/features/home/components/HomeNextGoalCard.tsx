import { Crown, Target } from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";
import type { HomeMotivationViewModel } from "@/lib/ux/types";

type HomeNextGoalCardProps = {
	viewModel: HomeMotivationViewModel;
};

export function HomeNextGoalCard({ viewModel }: HomeNextGoalCardProps) {
	return (
		<SectionCard className="flex h-full flex-col gap-4 px-5 py-5">
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-2">
					<p className="text-[0.72rem] font-semibold tracking-[0.18em] text-muted-foreground">次のレベルまで</p>
					<div className="space-y-1">
						<h2 className="text-xl font-black tracking-[-0.04em] text-base-content">{viewModel.nextGoalLabel}</h2>
						<p className="text-sm leading-6 text-muted-foreground">{viewModel.nextGoalDescription}</p>
					</div>
				</div>
				<div className="flex size-11 shrink-0 items-center justify-center rounded-[1.15rem] border border-primary/12 bg-surface-strong text-primary shadow-soft">
					<Crown className="size-5" strokeWidth={2.2} />
				</div>
			</div>

			{viewModel.nextTierProgressPercent === null || viewModel.nextTierName === null ? (
				<div className="rounded-[1.1rem] border border-primary/12 bg-surface-soft px-4 py-3 text-sm font-semibold text-muted-foreground">
					最高 tier をキープ中。次はランキング上位を狙おう。
				</div>
			) : (
				<div className="space-y-3">
					<div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
						<span>{viewModel.currentTierName}</span>
						<span>{viewModel.nextTierName}</span>
					</div>
					<div
						role="progressbar"
						aria-label="次のレベルまでの進捗"
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={viewModel.nextTierProgressPercent}
						className="h-2.5 overflow-hidden rounded-full bg-surface-strong"
					>
						<div
							className="h-full rounded-full bg-[linear-gradient(135deg,#ff8fbd,#ffbf8c)]"
							style={{ width: `${viewModel.nextTierProgressPercent}%` }}
						/>
					</div>
					<div className="inline-flex w-fit items-center gap-2 rounded-pill border border-primary/12 bg-surface-soft px-3 py-1.5 text-sm font-semibold text-base-content">
						<Target className="size-4 text-primary" strokeWidth={2.1} />
						{viewModel.nextTierHint}
					</div>
				</div>
			)}
		</SectionCard>
	);
}
