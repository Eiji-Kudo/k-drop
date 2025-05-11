import { GlobalProvider } from '@/context/GlobalContext'
import { supabase } from '@/utils/supabase'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { useSyncUnansweredQuizIds } from '../useSyncUnansweredQuizIds'

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
    const userQuizAnswersMock = [{ quiz_id: 1 }, { quiz_id: 2 }]
    const quizzesMock = [
      { quiz_id: 1 },
      { quiz_id: 2 },
      { quiz_id: 3 },
      { quiz_id: 4 },
    ]

    const mockThen = jest.fn().mockImplementation((callback) => {
      return Promise.resolve().then(() => {
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

    const mockFrom = jest.fn().mockImplementation((tableName) => {
      const mockObj = {
        tableName,
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        then: mockThen,
      }
      mockThen.mock.instances.push(mockObj)
      return mockObj
    })

    ;(supabase.from as jest.Mock) = mockFrom

    renderHook(() => useSyncUnansweredQuizIds(1), { wrapper })

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('user_quiz_answers')
      expect(mockFrom).toHaveBeenCalledWith('quizzes')
    })
  })

  it('should handle app user not found error', async () => {
    queryClient.clear()

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

    const mockFromImplementation = jest.fn()
    ;(supabase.from as jest.Mock) = mockFromImplementation

    mockFromImplementation.mockImplementation((_table) => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: jest
        .fn()
        .mockImplementation((callback) =>
          Promise.resolve().then(() => callback({ data: [], error: null })),
        ),
    }))

    renderHook(() => useSyncUnansweredQuizIds(1), { wrapper })

    await waitFor(() => {
      expect(mockFromImplementation).toHaveBeenCalledWith('quizzes')
    })

    expect(mockFromImplementation).not.toHaveBeenCalledWith('user_quiz_answers')
  })
})
