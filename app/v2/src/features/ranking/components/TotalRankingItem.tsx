import type { TotalRankingEntry } from "../types";

type TotalRankingItemProps = {
	entry: TotalRankingEntry;
};

export function TotalRankingItem({ entry }: TotalRankingItemProps) {
	return (
		<div className="flex items-center border-b border-base-300 py-4">
			<span className="w-12 shrink-0 text-lg font-bold text-primary">#{entry.rank}</span>
			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<span className="text-base font-semibold text-base-content">{entry.userName}</span>
				<span className="text-sm text-base-content/60">{entry.layerName}</span>
			</div>
			<span className="shrink-0 text-lg font-bold text-base-content">{entry.score}</span>
		</div>
	);
}
