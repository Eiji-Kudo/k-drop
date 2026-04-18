import { EmptyState } from "@/components/ui/EmptyState";
import { SectionCard } from "@/components/ui/SectionCard";
import type { GroupRankingEntry, TotalRankingEntry } from "../types";
import { GroupRankingItem } from "./GroupRankingItem";
import { TotalRankingItem } from "./TotalRankingItem";

type TotalRankingListProps = {
	type: "total";
	rankings: ReadonlyArray<TotalRankingEntry>;
};

type GroupRankingListProps = {
	type: "group";
	rankings: ReadonlyArray<GroupRankingEntry>;
};

type RankingListProps = TotalRankingListProps | GroupRankingListProps;

function getTotalRankingKey(entry: TotalRankingEntry) {
	return `total-${entry.rank}-${entry.userName}`;
}

function getGroupRankingKey(entry: GroupRankingEntry) {
	return `group-${entry.groupName}-${entry.rank}-${entry.userName}`;
}

export function RankingList(props: RankingListProps) {
	if (props.rankings.length === 0) {
		return <EmptyState title="ランキングはまだありません" description="最初の挑戦が入ると、このエリアに順位が表示されます。" />;
	}

	if (props.type === "total") {
		return (
			<SectionCard className="overflow-hidden px-0 py-0">
				{props.rankings.map((entry) => (
					<TotalRankingItem key={getTotalRankingKey(entry)} entry={entry} />
				))}
			</SectionCard>
		);
	}

	return (
		<SectionCard className="overflow-hidden px-0 py-0">
			{props.rankings.map((entry) => (
				<GroupRankingItem key={getGroupRankingKey(entry)} entry={entry} />
			))}
		</SectionCard>
	);
}
