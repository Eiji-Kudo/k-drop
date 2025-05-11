import { GlobalProvider } from '@/context/GlobalContext'
import { supabase } from '@/utils/supabase'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { useSyncUnansweredQuizIds } from '../useSyncUnansweredQuizIds'

// Mock the useAppUser hook
jest.mock('@/hooks/useAppUser', () => ({
  useAppUser: jest.fn().mockReturnValue({
    appUserId: 1,
    loading: false,
    error: null,
    authUser: { id: 'test-user-id' },
  }),
}))

describe('useSyncUnansweredQuizIds - integration', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>{children}</GlobalProvider>
    </QueryClientProvider>
  )

  beforeEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
  })

  it('should sync unanswered quiz IDs using actual useAppUser', async () => {
    // Create mock responses
    const userQuizAnswersMock = [{ quiz_id: 1 }, { quiz_id: 2 }]
    const quizzesMock = [
      { quiz_id: 1 },
      { quiz_id: 2 },
      { quiz_id: 3 },
      { quiz_id: 4 },
    ]

    // Setup "then" implementation
    const mockThen = jest.fn().mockImplementation((callback) => {
      return Promise.resolve().then(() => {
        // Get the table name from closure
        const instances = mockThen.mock.instances
        const firstInstance = instances.length > 0 ? instances[0] : null
        const table =
          firstInstance && typeof firstInstance === 'object'
            ? ((firstInstance as Record<string, unknown>).tableName as string)
            : undefined

        if (table === 'user_quiz_answers')
          return callback({ data: userQuizAnswersMock, error: null })
        if (table === 'quizzes')
          return callback({ data: quizzesMock, error: null })
        return callback({ data: [], error: null })
      })
    })

    // Setup the from mock
    const mockFrom = jest.fn().mockImplementation((tableName) => {
      const mockObj = {
        tableName,
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        then: mockThen,
      }
      // Store table name for access in mockThen
      mockThen.mock.instances.push(mockObj)
      return mockObj
    })

    // Assign the mock
    ;(supabase.from as jest.Mock) = mockFrom

    // Render the hook
    renderHook(() => useSyncUnansweredQuizIds(1), { wrapper })

    // Wait for queries and verify calls
    await waitFor(() => {
      // Verify tables were queried
      expect(mockFrom).toHaveBeenCalledWith('user_quiz_answers')
      expect(mockFrom).toHaveBeenCalledWith('quizzes')
    })
  })

  it('should handle app user not found error', async () => {
    // Clear mock data from previous tests
    queryClient.clear()

    // Override the useAppUser hook for this test
    const appUserModule = require('@/hooks/useAppUser') as {
      useAppUser: jest.Mock
    }
    const useAppUser = appUserModule.useAppUser
    useAppUser.mockReturnValue({
      appUserId: null,
      loading: false,
      error: null,
      authUser: null,
    })

    // Set up table specific mocks for this test
    const mockFromImplementation = jest.fn()
    ;(supabase.from as jest.Mock) = mockFromImplementation

    // Setup mock for 'quizzes' to be called in the test (idolGroupId=1 in the test)
    mockFromImplementation.mockImplementation((table) => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: jest
        .fn()
        .mockImplementation((callback) =>
          Promise.resolve().then(() => callback({ data: [], error: null })),
        ),
    }))
    // When idolGroupId is non-null but appUserId is null, only quizzes query runs

    // Render the hook
    renderHook(() => useSyncUnansweredQuizIds(1), { wrapper })

    // Wait a moment to let queries execute
    await waitFor(() => {
      expect(mockFromImplementation).toHaveBeenCalledWith('quizzes')
    })

    // Verify user_quiz_answers was NOT called (because appUserId is null)
    expect(mockFromImplementation).not.toHaveBeenCalledWith('user_quiz_answers')
  })
})
