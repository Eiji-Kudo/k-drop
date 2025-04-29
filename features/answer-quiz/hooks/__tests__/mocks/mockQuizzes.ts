/* istanbul ignore file */
/**
 * @jest-environment jsdom
 * @jest-ignore
 */

import { Tables } from '@/database.types'

// Mock data for quizzes
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
