import type { QuizResultData } from "@/components/quiz-result/types";
import { getCurrentUserScore, getTierProgress } from "@/lib/ux/progression";
import type { QuizResultMotivationViewModel } from "@/lib/ux/types";

export function createQuizResultMotivationViewModel(
	data: QuizResultData,
	groupName = "BLACKPINK",
	currentScore = getCurrentUserScore(),
): QuizResultMotivationViewModel {
	const correctCount = data.results.filter((result) => result.isCorrect).length;
	const accuracy = correctCount / data.results.length;
	const headline = accuracy >= 0.8 ? "かなり仕上がってきた" : accuracy >= 0.5 ? "この調子で伸ばせる" : "次でしっかり巻き返せる";
	const nextProgress = getTierProgress(currentScore + data.totalScore);

	// TODO: 実データ接続時は quiz_sessions / user_score_snapshots から前回比を算出する。
	return {
		correctCount,
		totalQuestionCount: data.results.length,
		gainedScore: data.totalScore,
		resultHeadline: headline,
		growthLabel: `${groupName} 力アップ`,
		pointsToNextTier: nextProgress.pointsToNextTier,
		deltaFromPreviousRunLabel: "前回より +2問",
		primaryRetryLabel: "もう一度解く",
		secondaryRetryLabel: "別グループでも挑戦",
		nextTierName: nextProgress.nextTier?.name ?? null,
		progressPercent: nextProgress.progressPercent,
	};
}
