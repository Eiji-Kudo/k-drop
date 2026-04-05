import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RankingList } from "./-components/RankingList";
import { RankingTabs } from "./-components/RankingTabs";
import { getGroupRankings, IDOL_GROUPS, TOTAL_RANKINGS } from "./-mock-data";

function RankingPage() {
	const [activeIndex, setActiveIndex] = useState(0);
	const selectedGroup = activeIndex > 0 ? IDOL_GROUPS[activeIndex - 1] : undefined;

	return (
		<main className="flex flex-1 flex-col gap-4">
			<h1 className="text-2xl font-bold">ランキング</h1>
			<div className="-mx-4 sm:-mx-6">
				<RankingTabs activeIndex={activeIndex} groups={IDOL_GROUPS} onTabPress={setActiveIndex} />
			</div>
			<div className="-mx-4 sm:-mx-6">
				{selectedGroup ? (
					<RankingList type="group" rankings={getGroupRankings(selectedGroup.id)} />
				) : (
					<RankingList type="total" rankings={TOTAL_RANKINGS} />
				)}
			</div>
		</main>
	);
}

export const Route = createFileRoute("/(tabs)/ranking/")({
	component: RankingPage,
});
