import { composeFactory } from "@praha/drizzle-factory";
import { authIdentitiesFactory, userProfilesFactory, usersFactory } from "./auth-factories";
import { dropTransactionsFactory, dropWalletsFactory } from "./drop-factories";
import { eventGroupsFactory, eventParticipantsFactory, eventsFactory } from "./event-factories";
import { groupCategoriesFactory, idolGroupsFactory, userFavoriteGroupsFactory } from "./group-factories";
import { leaderboardEntriesFactory, leaderboardSnapshotsFactory } from "./leaderboard-factories";
import { quizChoicesFactory, quizzesFactory } from "./quiz-content-factories";
import { quizAnswersFactory, quizSessionQuestionsFactory, quizSessionsFactory } from "./quiz-session-factories";
import { scoreTiersFactory, userScoreSnapshotsFactory, userScoreStatesFactory } from "./score-factories";

export const testFactories = composeFactory({
	users: usersFactory,
	authIdentities: authIdentitiesFactory,
	userProfiles: userProfilesFactory,
	groupCategories: groupCategoriesFactory,
	idolGroups: idolGroupsFactory,
	userFavoriteGroups: userFavoriteGroupsFactory,
	quizzes: quizzesFactory,
	quizChoices: quizChoicesFactory,
	quizSessions: quizSessionsFactory,
	quizSessionQuestions: quizSessionQuestionsFactory,
	quizAnswers: quizAnswersFactory,
	scoreTiers: scoreTiersFactory,
	userScoreStates: userScoreStatesFactory,
	userScoreSnapshots: userScoreSnapshotsFactory,
	dropWallets: dropWalletsFactory,
	dropTransactions: dropTransactionsFactory,
	events: eventsFactory,
	eventGroups: eventGroupsFactory,
	eventParticipants: eventParticipantsFactory,
	leaderboardSnapshots: leaderboardSnapshotsFactory,
	leaderboardEntries: leaderboardEntriesFactory,
});
