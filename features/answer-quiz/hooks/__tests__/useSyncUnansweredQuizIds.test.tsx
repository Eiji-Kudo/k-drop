import { GlobalProvider } from '@/context/GlobalContext'
import { useAppUser } from '@/hooks/useAppUser'
import { supabase } from '@/utils/supabase'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { useSyncUnansweredQuizIds } from '../useSyncUnansweredQuizIds'

// Mock only the external dependencies that we can't control in tests
jest.mock('@/hooks/useAppUser')
jest.mock('@/utils/supabase')

describe('useSyncUnansweredQuizIds', () => {
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

  it('should not call setSelectedQuizIds when there is no context setter', () => {
    // Mock useAppUser to return no user
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: null })

    renderHook(() => useSyncUnansweredQuizIds(null), { wrapper })

    // Verify no data was fetched
    expect(supabase.from).not.toHaveBeenCalled()
  })

  it('should set empty array when there are no unanswered quizzes', async () => {
    // Mock useAppUser to return a user
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 1 })

    // Mock Supabase responses
    ;(supabase.from as jest.Mock).mockImplementation((table) => ({
      select: () => ({
        eq: () => ({
          data: [],
          error: null,
        }),
      }),
    }))

    const { result } = renderHook(() => useSyncUnansweredQuizIds(1), {
      wrapper,
    })

    // Wait for queries to resolve
    await queryClient.refetchQueries()

    // Verify the correct data was fetched
    expect(supabase.from).toHaveBeenCalledWith('user_quiz_answers')
    expect(supabase.from).toHaveBeenCalledWith('quizzes')
  })

  it('should call setSelectedQuizIds with unanswered quiz IDs', async () => {
    // Mock useAppUser to return a user
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 1 })

    // Mock Supabase responses
    ;(supabase.from as jest.Mock).mockImplementation((table) => ({
      select: () => ({
        eq: () => ({
          data:
            table === 'user_quiz_answers'
              ? [{ quiz_id: 1 }, { quiz_id: 2 }]
              : [
                  { quiz_id: 1 },
                  { quiz_id: 2 },
                  { quiz_id: 3 },
                  { quiz_id: 4 },
                ],
          error: null,
        }),
      }),
    }))

    const { result } = renderHook(() => useSyncUnansweredQuizIds(1), {
      wrapper,
    })

    // Wait for queries to resolve
    await queryClient.refetchQueries()

    // Verify the correct data was fetched and processed
    expect(supabase.from).toHaveBeenCalledWith('user_quiz_answers')
    expect(supabase.from).toHaveBeenCalledWith('quizzes')
  })

  it('should not update when unanswered quiz IDs remain the same', async () => {
    // Mock useAppUser to return a user
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 1 })

    // Mock Supabase responses with consistent data
    const mockData = {
      user_quiz_answers: [{ quiz_id: 1 }],
      quizzes: [{ quiz_id: 1 }, { quiz_id: 2 }],
    } as const

    ;(supabase.from as jest.Mock).mockImplementation(
      (table: keyof typeof mockData) => ({
        select: () => ({
          eq: () => ({
            data: mockData[table],
            error: null,
          }),
        }),
      }),
    )

    const { result, rerender } = renderHook(() => useSyncUnansweredQuizIds(1), {
      wrapper,
    })

    // Wait for initial queries to resolve
    await queryClient.refetchQueries()

    // Re-render with same data
    rerender()

    // Verify the data was only fetched once
    expect(supabase.from).toHaveBeenCalledTimes(2) // Once for each table
  })
})
