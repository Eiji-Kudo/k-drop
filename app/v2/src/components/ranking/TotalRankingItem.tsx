import type { TotalRankingEntry } from "./types";

type TotalRankingItemProps = {
	entry: TotalRankingEntry;
};

export function TotalRankingItem({ entry }: TotalRankingItemProps) {
	return (
		<div className="flex items-center gap-3 border-b border-border-soft px-4 py-4 last:border-b-0">
			<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-strong text-sm font-black text-primary shadow-soft">
				#{entry.rank}
			</span>
			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<span className="text-base font-black tracking-[-0.02em] text-base-content">{entry.userName}</span>
				<span className="text-sm text-muted-foreground">{entry.layerName}</span>
			</div>
			<span className="shrink-0 text-lg font-black tracking-[-0.03em] text-base-content">{entry.score}</span>
		</div>
	);
}
