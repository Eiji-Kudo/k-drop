import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { RankingList } from "./components/RankingList";
import { RankingTabs } from "./components/RankingTabs";
import { getGroupRankings, IDOL_GROUPS, TOTAL_RANKINGS } from "./mock-data";

export function RankingPage() {
	const [activeIndex, setActiveIndex] = useState(0);
	const selectedGroup = activeIndex > 0 ? IDOL_GROUPS[activeIndex - 1] : undefined;

	return (
		<PageShell className="gap-4">
			<PageHeader eyebrow="RANKING" title="ランキング" description="まずは一覧やタブの土台トーンを揃え、後続 issue で競争演出を強めやすくする。" />
			<RankingTabs activeIndex={activeIndex} groups={IDOL_GROUPS} onTabPress={setActiveIndex} />
			{selectedGroup ? (
				<RankingList type="group" rankings={getGroupRankings(selectedGroup.id)} />
			) : (
				<RankingList type="total" rankings={TOTAL_RANKINGS} />
			)}
		</PageShell>
	);
}
