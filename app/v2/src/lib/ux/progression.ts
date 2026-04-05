import { CURRENT_USER, SCORE_TIERS } from "@/lib/ux/mock-state";

function clampPercent(value: number) {
	return Math.max(0, Math.min(100, Math.round(value)));
}

export function getTierProgress(score: number) {
	// `pointsToNextTier` と `progressPercent` は現在 score と tier 閾値の差分から導出する。
	// 実データ接続時も score_tiers / user_score_states の関係で同じルールを使う前提。
	const currentTier = SCORE_TIERS.findLast((tier) => score >= tier.minScore) ?? SCORE_TIERS[0];
	const currentIndex = SCORE_TIERS.findIndex((tier) => tier.name === currentTier.name);
	const nextTier = SCORE_TIERS[currentIndex + 1] ?? null;

	if (!nextTier) {
		return {
			currentTier,
			nextTier: null,
			pointsToNextTier: null,
			progressPercent: null,
		};
	}

	const previousThreshold = currentTier.minScore;
	const nextThreshold = nextTier.minScore;
	const span = nextThreshold - previousThreshold;
	const rawProgress = span === 0 ? 100 : ((score - previousThreshold) / span) * 100;

	return {
		currentTier,
		nextTier,
		pointsToNextTier: Math.max(0, nextThreshold - score),
		progressPercent: clampPercent(rawProgress),
	};
}

export function formatFanSince(date: Date, now: Date = new Date()) {
	const diffInDays = Math.max(0, Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)));
	const years = Math.floor(diffInDays / 365);
	const months = Math.floor((diffInDays % 365) / 30);

	if (years > 0) {
		return `${years}年${months > 0 ? `${months}か月` : ""}`;
	}

	if (months > 0) {
		return `${months}か月`;
	}

	return "今月スタート";
}

export function getMasteryTier(score: number) {
	if (score >= 900) return "コア";
	if (score >= 700) return "得意";
	if (score >= 500) return "成長中";
	return "これから";
}

export function getCurrentUserScore() {
	return CURRENT_USER.currentScore;
}
