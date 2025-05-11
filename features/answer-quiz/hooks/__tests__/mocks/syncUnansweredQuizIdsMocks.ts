/* istanbul ignore file */
/**
 * @jest-environment jsdom
 * @jest-ignore
 */

import { useGlobalContext } from '@/context/GlobalContext'
import { useQuery } from '@tanstack/react-query'
import { createLimitedMockQuizzes } from './limitedMockQuizzes'
import { mockRef } from './mockData'
import { createMockQuizzes } from './mockQuizzes'
import {
  createMockUserQuizAnswers,
  createSingleMockUserQuizAnswer,
} from './mockUserQuizAnswers'

// Setup mocks
export const setupMocks = (): void => {
  jest.mock('@/context/GlobalContext')
  jest.mock('@tanstack/react-query')
}

// Re-export the mockRef for tests to use
export { mockRef }

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
