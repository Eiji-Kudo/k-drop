/* istanbul ignore file */
/**
 * @jest-environment jsdom
 * @jest-ignore
 */

import { Tables } from '@/database.types'

// Mock data for quizzes
export const createMockQuizzes = () => [
  {
    quiz_id: 1,
    idol_group_id: 1,
    prompt: 'Q1',
    explanation: 'Explanation 1',
    quiz_difficulty_id: 1,
    choices: [
      {
        quiz_choice_id: 1,
        quiz_id: 1,
        choice_text: 'A',
        is_correct: true,
      },
      {
        quiz_choice_id: 2,
        quiz_id: 1,
        choice_text: 'B',
        is_correct: false,
      },
      {
        quiz_choice_id: 3,
        quiz_id: 1,
        choice_text: 'C',
        is_correct: false,
      },
      {
        quiz_choice_id: 4,
        quiz_id: 1,
        choice_text: 'D',
        is_correct: false,
      },
    ],
  },
  {
    quiz_id: 2,
    idol_group_id: 1,
    prompt: 'Q2',
    explanation: 'Explanation 2',
    quiz_difficulty_id: 1,
    choices: [
      {
        quiz_choice_id: 5,
        quiz_id: 2,
        choice_text: 'A',
        is_correct: false,
      },
      {
        quiz_choice_id: 6,
        quiz_id: 2,
        choice_text: 'B',
        is_correct: true,
      },
      {
        quiz_choice_id: 7,
        quiz_id: 2,
        choice_text: 'C',
        is_correct: false,
      },
      {
        quiz_choice_id: 8,
        quiz_id: 2,
        choice_text: 'D',
        is_correct: false,
      },
    ],
  },
  {
    quiz_id: 3,
    idol_group_id: 1,
    prompt: 'Q3',
    explanation: 'Explanation 3',
    quiz_difficulty_id: 1,
    choices: [
      {
        quiz_choice_id: 9,
        quiz_id: 3,
        choice_text: 'A',
        is_correct: false,
      },
      {
        quiz_choice_id: 10,
        quiz_id: 3,
        choice_text: 'B',
        is_correct: false,
      },
      {
        quiz_choice_id: 11,
        quiz_id: 3,
        choice_text: 'C',
        is_correct: true,
      },
      {
        quiz_choice_id: 12,
        quiz_id: 3,
        choice_text: 'D',
        is_correct: false,
      },
    ],
  },
  {
    quiz_id: 4,
    idol_group_id: 1,
    prompt: 'Q4',
    explanation: 'Explanation 4',
    quiz_difficulty_id: 1,
    choices: [
      {
        quiz_choice_id: 13,
        quiz_id: 4,
        choice_text: 'A',
        is_correct: false,
      },
      {
        quiz_choice_id: 14,
        quiz_id: 4,
        choice_text: 'B',
        is_correct: false,
      },
      {
        quiz_choice_id: 15,
        quiz_id: 4,
        choice_text: 'C',
        is_correct: false,
      },
      {
        quiz_choice_id: 16,
        quiz_id: 4,
        choice_text: 'D',
        is_correct: true,
      },
    ],
  },
]

// Shorter quiz list for the last test case
export const createLimitedMockQuizzes = () => [
  {
    quiz_id: 1,
    idol_group_id: 1,
    prompt: 'Q1',
    explanation: 'Explanation 1',
    quiz_difficulty_id: 1,
    choices: [
      {
        quiz_choice_id: 1,
        quiz_id: 1,
        choice_text: 'A',
        is_correct: true,
      },
      {
        quiz_choice_id: 2,
        quiz_id: 1,
        choice_text: 'B',
        is_correct: false,
      },
      {
        quiz_choice_id: 3,
        quiz_id: 1,
        choice_text: 'C',
        is_correct: false,
      },
      {
        quiz_choice_id: 4,
        quiz_id: 1,
        choice_text: 'D',
        is_correct: false,
      },
    ],
  },
  {
    quiz_id: 2,
    idol_group_id: 1,
    prompt: 'Q2',
    explanation: 'Explanation 2',
    quiz_difficulty_id: 1,
    choices: [
      {
        quiz_choice_id: 5,
        quiz_id: 2,
        choice_text: 'A',
        is_correct: false,
      },
      {
        quiz_choice_id: 6,
        quiz_id: 2,
        choice_text: 'B',
        is_correct: true,
      },
      {
        quiz_choice_id: 7,
        quiz_id: 2,
        choice_text: 'C',
        is_correct: false,
      },
      {
        quiz_choice_id: 8,
        quiz_id: 2,
        choice_text: 'D',
        is_correct: false,
      },
    ],
  },
]
