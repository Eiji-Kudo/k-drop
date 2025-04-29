/* istanbul ignore file */
/**
 * @jest-environment jsdom
 * @jest-ignore
 */

import { Tables } from '@/database.types'

// Mock data for user quiz answers
export const createMockUserQuizAnswers = (): Tables<'user_quiz_answers'>[] => [
  {
    app_user_id: 1,
    quiz_id: 1,
    selected_choice: 2,
    is_correct: true,
    answered_at: '2023-01-01',
    user_quiz_answer_id: 1,
  },
  {
    app_user_id: 1,
    quiz_id: 2,
    selected_choice: 1,
    is_correct: false,
    answered_at: '2023-01-01',
    user_quiz_answer_id: 2,
  },
]

export const createSingleMockUserQuizAnswer =
  (): Tables<'user_quiz_answers'>[] => [
    {
      app_user_id: 1,
      quiz_id: 1,
      selected_choice: 2,
      is_correct: true,
      answered_at: '2023-01-01',
      user_quiz_answer_id: 1,
    },
  ]
