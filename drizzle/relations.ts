import { relations } from 'drizzle-orm/relations'
import {
  groupCategories,
  idolGroups,
  quizzes,
  quizDifficulties,
  appUsers,
  monthlyScoreHistories,
  events,
  eventGroupParticipations,
  eventParticipations,
  rankingGroups,
  rankingTotals,
  userIdolGroupScores,
  groupOtakuLayers,
  userProfiles,
  totalOtakuLayers,
  userQuizAnswers,
  quizChoices,
} from './schema'

export const idolGroupsRelations = relations(idolGroups, ({ one, many }) => ({
  groupCategory: one(groupCategories, {
    fields: [idolGroups.groupCategoryId],
    references: [groupCategories.groupCategoryId],
  }),
  quizzes: many(quizzes),
  eventGroupParticipations: many(eventGroupParticipations),
  rankingGroups: many(rankingGroups),
  userIdolGroupScores: many(userIdolGroupScores),
}))

export const groupCategoriesRelations = relations(
  groupCategories,
  ({ many }) => ({
    idolGroups: many(idolGroups),
  }),
)

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  idolGroup: one(idolGroups, {
    fields: [quizzes.idolGroupId],
    references: [idolGroups.idolGroupId],
  }),
  quizDifficulty: one(quizDifficulties, {
    fields: [quizzes.quizDifficultyId],
    references: [quizDifficulties.quizDifficultyId],
  }),
  userQuizAnswers: many(userQuizAnswers),
  quizChoices: many(quizChoices),
}))

export const quizDifficultiesRelations = relations(
  quizDifficulties,
  ({ many }) => ({
    quizzes: many(quizzes),
  }),
)

export const monthlyScoreHistoriesRelations = relations(
  monthlyScoreHistories,
  ({ one }) => ({
    appUser: one(appUsers, {
      fields: [monthlyScoreHistories.appUserId],
      references: [appUsers.appUserId],
    }),
  }),
)

export const appUsersRelations = relations(appUsers, ({ many }) => ({
  monthlyScoreHistories: many(monthlyScoreHistories),
  events: many(events),
  eventParticipations: many(eventParticipations),
  rankingGroups: many(rankingGroups),
  rankingTotals: many(rankingTotals),
  userIdolGroupScores: many(userIdolGroupScores),
  userProfiles: many(userProfiles),
  userQuizAnswers: many(userQuizAnswers),
}))

export const eventsRelations = relations(events, ({ one, many }) => ({
  appUser: one(appUsers, {
    fields: [events.createdBy],
    references: [appUsers.appUserId],
  }),
  eventGroupParticipations: many(eventGroupParticipations),
  eventParticipations: many(eventParticipations),
}))

export const eventGroupParticipationsRelations = relations(
  eventGroupParticipations,
  ({ one }) => ({
    event: one(events, {
      fields: [eventGroupParticipations.eventId],
      references: [events.eventId],
    }),
    idolGroup: one(idolGroups, {
      fields: [eventGroupParticipations.idolGroupId],
      references: [idolGroups.idolGroupId],
    }),
  }),
)

export const eventParticipationsRelations = relations(
  eventParticipations,
  ({ one }) => ({
    event: one(events, {
      fields: [eventParticipations.eventId],
      references: [events.eventId],
    }),
    appUser: one(appUsers, {
      fields: [eventParticipations.appUserId],
      references: [appUsers.appUserId],
    }),
  }),
)

export const rankingGroupsRelations = relations(rankingGroups, ({ one }) => ({
  appUser: one(appUsers, {
    fields: [rankingGroups.appUserId],
    references: [appUsers.appUserId],
  }),
  idolGroup: one(idolGroups, {
    fields: [rankingGroups.idolGroupId],
    references: [idolGroups.idolGroupId],
  }),
}))

export const rankingTotalsRelations = relations(rankingTotals, ({ one }) => ({
  appUser: one(appUsers, {
    fields: [rankingTotals.appUserId],
    references: [appUsers.appUserId],
  }),
}))

export const userIdolGroupScoresRelations = relations(
  userIdolGroupScores,
  ({ one }) => ({
    appUser: one(appUsers, {
      fields: [userIdolGroupScores.appUserId],
      references: [appUsers.appUserId],
    }),
    idolGroup: one(idolGroups, {
      fields: [userIdolGroupScores.idolGroupId],
      references: [idolGroups.idolGroupId],
    }),
    groupOtakuLayer: one(groupOtakuLayers, {
      fields: [userIdolGroupScores.groupOtakuLayerId],
      references: [groupOtakuLayers.groupOtakuLayerId],
    }),
  }),
)

export const groupOtakuLayersRelations = relations(
  groupOtakuLayers,
  ({ many }) => ({
    userIdolGroupScores: many(userIdolGroupScores),
  }),
)

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  appUser: one(appUsers, {
    fields: [userProfiles.appUserId],
    references: [appUsers.appUserId],
  }),
  totalOtakuLayer: one(totalOtakuLayers, {
    fields: [userProfiles.totalOtakuLayerId],
    references: [totalOtakuLayers.totalOtakuLayerId],
  }),
}))

export const totalOtakuLayersRelations = relations(
  totalOtakuLayers,
  ({ many }) => ({
    userProfiles: many(userProfiles),
  }),
)

export const userQuizAnswersRelations = relations(
  userQuizAnswers,
  ({ one }) => ({
    appUser: one(appUsers, {
      fields: [userQuizAnswers.appUserId],
      references: [appUsers.appUserId],
    }),
    quiz: one(quizzes, {
      fields: [userQuizAnswers.quizId],
      references: [quizzes.quizId],
    }),
  }),
)

export const quizChoicesRelations = relations(quizChoices, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizChoices.quizId],
    references: [quizzes.quizId],
  }),
}))
