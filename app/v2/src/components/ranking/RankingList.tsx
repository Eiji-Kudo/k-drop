import { GroupRankingItem } from "./GroupRankingItem";
import { TotalRankingItem } from "./TotalRankingItem";
import type { GroupRankingEntry, TotalRankingEntry } from "./types";

type TotalRankingListProps = {
	type: "total";
	rankings: ReadonlyArray<TotalRankingEntry>;
};

type GroupRankingListProps = {
	type: "group";
	rankings: ReadonlyArray<GroupRankingEntry>;
};

type RankingListProps = TotalRankingListProps | GroupRankingListProps;

export function RankingList(props: RankingListProps) {
	if (props.rankings.length === 0) {
		return (
			<div className="flex items-center justify-center py-12">
				<p className="text-base text-base-content/60">No rankings available</p>
			</div>
		);
	}

	if (props.type === "total") {
		return (
			<div className="px-4 py-3">
				{props.rankings.map((entry) => (
					<TotalRankingItem key={entry.rank} entry={entry} />
				))}
			</div>
		);
	}

	return (
		<div className="px-4 py-3">
			{props.rankings.map((entry) => (
				<GroupRankingItem key={entry.rank} entry={entry} />
			))}
		</div>
	);
}
