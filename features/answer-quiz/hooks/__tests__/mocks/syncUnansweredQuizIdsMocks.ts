/* istanbul ignore file */
/**
 * @jest-environment jsdom
 * @jest-ignore
 */

import { useGlobalContext } from '@/context/GlobalContext'
import { Tables } from '@/database.types'
import { useQuery } from '@tanstack/react-query'

// Mock useRef to control the prevUnansweredRef value
export const mockRef = { current: [99] } // Initialize with a value that will be different from test data

// Setup mocks
export const setupMocks = (): void => {
  jest.mock('@/context/GlobalContext')
  jest.mock('@tanstack/react-query')
  jest.mock('@/utils/supabase', () => ({
    supabase: {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    },
  }))

  jest.mock('react', () => {
    const originalReact = jest.requireActual('react')
    return {
      ...originalReact,
      useRef: jest.fn().mockImplementation(() => mockRef),
      useEffect: jest.fn().mockImplementation((fn) => fn()),
      useMemo: jest.fn().mockImplementation((fn) => fn()),
    }
  })
}

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

// Mock query implementations
export const setupQueryMocks = (
  mockSetSelectedQuizIds: jest.Mock,
  options?: {
    withUserAnswers?: boolean
    withQuizzes?: boolean
    withUserOnly?: boolean
    limitedQuizzes?: boolean
    singleAnswer?: boolean
  },
): void => {
  const {
    withUserAnswers = true,
    withQuizzes = true,
    withUserOnly = false,
    limitedQuizzes = false,
    singleAnswer = false,
  } = options || {}

  ;(useGlobalContext as jest.Mock).mockReturnValue({
    setSelectedQuizIds: mockSetSelectedQuizIds,
  })
  ;(useQuery as jest.Mock).mockImplementation(
    ({ queryKey }: { queryKey: string[] }) => {
      if (queryKey[0] === 'user') {
        return { data: { id: 'user-123' } }
      }
      if (withUserOnly) {
        return { data: undefined }
      }
      if (queryKey[0] === 'user_quiz_answers' && withUserAnswers) {
        if (singleAnswer) {
          return { data: createSingleMockUserQuizAnswer() }
        }
        return { data: createMockUserQuizAnswers() }
      }
      if (queryKey[0] === 'quizzes' && withQuizzes) {
        if (limitedQuizzes) {
          return { data: createLimitedMockQuizzes() }
        }
        return { data: createMockQuizzes() }
      }
      return { data: [] }
    },
  )
}
