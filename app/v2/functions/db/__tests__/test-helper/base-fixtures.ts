import { getTestFactories, type TestDb } from "./db";

const hasRecord = (sqliteDb: TestDb, table: string, column: string, value: string) =>
	Boolean(sqliteDb.prepare(`SELECT 1 FROM ${table} WHERE ${column} = ? LIMIT 1`).get(value));

export async function ensureBaseUser(sqliteDb: TestDb) {
	if (!hasRecord(sqliteDb, "users", "user_id", "user-1")) await getTestFactories(sqliteDb).users.traits.base.create();
	return "user-1";
}

export async function ensureBaseGroupCategory(sqliteDb: TestDb) {
	if (!hasRecord(sqliteDb, "group_categories", "group_category_id", "cat-1")) await getTestFactories(sqliteDb).groupCategories.traits.base.create();
	return "cat-1";
}

export async function ensureBaseIdolGroup(sqliteDb: TestDb) {
	await ensureBaseGroupCategory(sqliteDb);
	if (!hasRecord(sqliteDb, "idol_groups", "idol_group_id", "group-1")) await getTestFactories(sqliteDb).idolGroups.traits.base.create();
	return "group-1";
}

export async function ensureBaseQuiz(sqliteDb: TestDb) {
	await ensureBaseIdolGroup(sqliteDb);
	if (!hasRecord(sqliteDb, "quizzes", "quiz_id", "quiz-1")) await getTestFactories(sqliteDb).quizzes.traits.base.create();
	return "quiz-1";
}

export async function ensureBaseQuizChoice(sqliteDb: TestDb) {
	await ensureBaseQuiz(sqliteDb);
	if (!hasRecord(sqliteDb, "quiz_choices", "quiz_choice_id", "choice-1")) await getTestFactories(sqliteDb).quizChoices.traits.base.create();
	return "choice-1";
}

export async function ensureBaseQuizSession(sqliteDb: TestDb) {
	await ensureBaseUser(sqliteDb);
	await ensureBaseIdolGroup(sqliteDb);
	if (!hasRecord(sqliteDb, "quiz_sessions", "quiz_session_id", "session-1")) await getTestFactories(sqliteDb).quizSessions.traits.base.create();
	return "session-1";
}

export async function ensureBaseSessionQuestion(sqliteDb: TestDb) {
	await ensureBaseQuizSession(sqliteDb);
	await ensureBaseQuiz(sqliteDb);
	if (!hasRecord(sqliteDb, "quiz_session_questions", "quiz_session_question_id", "sq-1"))
		await getTestFactories(sqliteDb).quizSessionQuestions.traits.base.create();
	return "sq-1";
}

export async function ensureBaseScoreTier(sqliteDb: TestDb) {
	if (!hasRecord(sqliteDb, "score_tiers", "score_tier_id", "tier-1")) await getTestFactories(sqliteDb).scoreTiers.traits.base.create();
	return "tier-1";
}

export async function ensureBaseGroupScoreTier(sqliteDb: TestDb) {
	if (!hasRecord(sqliteDb, "score_tiers", "score_tier_id", "tier-group-1")) await getTestFactories(sqliteDb).scoreTiers.traits.groupBase.create();
	return "tier-group-1";
}

export async function ensureBaseEvent(sqliteDb: TestDb) {
	await ensureBaseUser(sqliteDb);
	if (!hasRecord(sqliteDb, "events", "event_id", "event-1")) await getTestFactories(sqliteDb).events.traits.base.create();
	return "event-1";
}

export async function ensureBaseLeaderboardSnapshot(sqliteDb: TestDb) {
	if (!hasRecord(sqliteDb, "leaderboard_snapshots", "leaderboard_snapshot_id", "leaderboard-1"))
		await getTestFactories(sqliteDb).leaderboardSnapshots.traits.base.create();
	return "leaderboard-1";
}

export async function ensureBaseGroupLeaderboardSnapshot(sqliteDb: TestDb) {
	await ensureBaseIdolGroup(sqliteDb);
	if (!hasRecord(sqliteDb, "leaderboard_snapshots", "leaderboard_snapshot_id", "leaderboard-group-1"))
		await getTestFactories(sqliteDb).leaderboardSnapshots.traits.groupBase.create();
	return "leaderboard-group-1";
}
