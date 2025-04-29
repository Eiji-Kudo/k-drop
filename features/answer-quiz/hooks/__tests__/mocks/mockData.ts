/* istanbul ignore file */
/**
 * @jest-environment jsdom
 * @jest-ignore
 */

import { Tables } from '@/database.types'

// Mock useRef to control the prevUnansweredRef value
export const mockRef = { current: [99] } // Initialize with a value that will be different from test data

// Mock data for tests
export const createMockQuizzes = (): Tables<'quizzes'>[] => [
  {
    quiz_id: 1,
    idol_group_id: 1,
    prompt: 'Q1',
    choice1: 'A',
    choice2: 'B',
    choice3: 'C',
    choice4: 'D',
    correct_choice: 1,
    explanation: 'Explanation 1',
    quiz_difficulty_id: 1,
  },
  {
    quiz_id: 2,
    idol_group_id: 1,
    prompt: 'Q2',
    choice1: 'A',
    choice2: 'B',
    choice3: 'C',
    choice4: 'D',
    correct_choice: 2,
    explanation: 'Explanation 2',
    quiz_difficulty_id: 1,
  },
  {
    quiz_id: 3,
    idol_group_id: 1,
    prompt: 'Q3',
    choice1: 'A',
    choice2: 'B',
    choice3: 'C',
    choice4: 'D',
    correct_choice: 3,
    explanation: 'Explanation 3',
    quiz_difficulty_id: 1,
  },
  {
    quiz_id: 4,
    idol_group_id: 1,
    prompt: 'Q4',
    choice1: 'A',
    choice2: 'B',
    choice3: 'C',
    choice4: 'D',
    correct_choice: 4,
    explanation: 'Explanation 4',
    quiz_difficulty_id: 1,
  },
]

// Shorter quiz list for the last test case
export const createLimitedMockQuizzes = (): Tables<'quizzes'>[] => [
  {
    quiz_id: 1,
    idol_group_id: 1,
    prompt: 'Q1',
    choice1: 'A',
    choice2: 'B',
    choice3: 'C',
    choice4: 'D',
    correct_choice: 1,
    explanation: 'Explanation 1',
    quiz_difficulty_id: 1,
  },
  {
    quiz_id: 2,
    idol_group_id: 1,
    prompt: 'Q2',
    choice1: 'A',
    choice2: 'B',
    choice3: 'C',
    choice4: 'D',
    correct_choice: 2,
    explanation: 'Explanation 2',
    quiz_difficulty_id: 1,
  },
]

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
