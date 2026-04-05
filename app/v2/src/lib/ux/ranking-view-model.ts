import { getGroupRankings, TOTAL_RANKINGS } from "@/components/ranking/mock-data";
import { CURRENT_USER } from "@/lib/ux/mock-state";
import { getTierProgress } from "@/lib/ux/progression";
import type { RankingEntry, RankingMotivationViewModel } from "@/lib/ux/types";

function createRankingEntry(entry: RankingEntry, isSelf = false) {
	return {
		rank: entry.rank,
		userName: entry.userName,
		tierName: entry.layerName,
		score: entry.score,
		...(isSelf ? { isSelf: true } : {}),
	};
}

function injectCurrentUser(entries: ReadonlyArray<RankingEntry>, currentScore: number) {
	const source = entries.map((entry) => ({ ...entry })).filter((entry) => entry.userName !== CURRENT_USER.rankingName);

	source.push({
		rank: 0,
		userName: CURRENT_USER.rankingName,
		layerName: getTierProgress(currentScore).currentTier.name,
		score: currentScore,
	});

	source.sort((left, right) => right.score - left.score);

	return source.map((entry, index) => ({
		...entry,
		rank: index + 1,
	}));
}

export function createRankingMotivationViewModel(scopeLabel: string, groupId?: string): RankingMotivationViewModel {
	const sourceEntries = groupId ? getGroupRankings(groupId) : TOTAL_RANKINGS;
	const currentScore = groupId ? (CURRENT_USER.topGroups.find((group) => group.groupId === groupId)?.score ?? 520) : CURRENT_USER.currentScore;
	const entries = injectCurrentUser(sourceEntries, currentScore);
	const selfIndex = entries.findIndex((entry) => entry.userName === CURRENT_USER.rankingName);
	const fullList = entries.map((entry) => createRankingEntry(entry, entry.userName === CURRENT_USER.rankingName));
	const topThree = entries.slice(0, 3).map((entry) => createRankingEntry(entry));
	const neighborStart = selfIndex <= 1 ? 0 : selfIndex - 1;
	const neighborEnd = Math.min(entries.length, neighborStart + 3);
	const neighbors =
		selfIndex >= 0
			? entries.slice(neighborStart, neighborEnd).map((entry) => createRankingEntry(entry, entry.userName === CURRENT_USER.rankingName))
			: [];
	const previousEntry = selfIndex > 0 ? entries[selfIndex - 1] : null;

	return {
		scopeLabel,
		topThree,
		aroundYou:
			selfIndex >= 0
				? {
						myRank: entries[selfIndex].rank,
						myScore: entries[selfIndex].score,
						myTierName: entries[selfIndex].layerName,
						neighbors,
						pointsToNextRank: previousEntry ? Math.max(0, previousEntry.score - entries[selfIndex].score) : null,
					}
				: null,
		fullList,
	};
}
