import { GlobalProvider } from '@/context/GlobalContext'
import { useAppUser } from '@/hooks/useAppUser'
import { supabase } from '@/utils/supabase'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { useSyncUnansweredQuizIds } from '../useSyncUnansweredQuizIds'

// Mock useAppUser hook
jest.mock('@/hooks/useAppUser')

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

  it('should not call setSelectedQuizIds when there is no context setter', async () => {
    // Mock useAppUser to return no user
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: null })

    renderHook(() => useSyncUnansweredQuizIds(null), { wrapper })

    // Wait for queries to resolve
    await queryClient.refetchQueries()

    // Verify no data was fetched
    expect(supabase.from).not.toHaveBeenCalled()
  })

  it('should set empty array when there are no unanswered quizzes', async () => {
    // Mock useAppUser to return a user
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 1 })

    // Mock empty quiz answers and quizzes
    ;(supabase.from as jest.Mock).mockImplementation((table) => ({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
    }))

    const { result } = renderHook(() => useSyncUnansweredQuizIds(1), { wrapper })

    // Wait for queries to resolve
    await queryClient.refetchQueries()

    // Verify the correct data was fetched
    expect(supabase.from).toHaveBeenCalledWith('user_quiz_answers')
    expect(supabase.from).toHaveBeenCalledWith('quizzes')
  })

  it('should call setSelectedQuizIds with unanswered quiz IDs', async () => {
    // Mock useAppUser to return a user
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 1 })

    // Mock quiz answers and quizzes
    ;(supabase.from as jest.Mock).mockImplementation((table) => ({
      select: () => ({
        eq: () => {
          if (table === 'user_quiz_answers') {
            return Promise.resolve({
              data: [{ quiz_id: 1 }, { quiz_id: 2 }],
              error: null,
            })
          }
          return Promise.resolve({
            data: [
              { quiz_id: 1 },
              { quiz_id: 2 },
              { quiz_id: 3 },
              { quiz_id: 4 },
            ],
            error: null,
          })
        },
      }),
    }))

    const { result } = renderHook(() => useSyncUnansweredQuizIds(1), { wrapper })

    // Wait for queries to resolve
    await queryClient.refetchQueries()

    // Verify the correct data was fetched and processed
    expect(supabase.from).toHaveBeenCalledWith('user_quiz_answers')
    expect(supabase.from).toHaveBeenCalledWith('quizzes')
  })

  it('should not update when unanswered quiz IDs remain the same', async () => {
    // Mock useAppUser to return a user
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 1 })

    // Mock consistent quiz answers and quizzes
    ;(supabase.from as jest.Mock).mockImplementation((table) => ({
      select: () => ({
        eq: () => {
          if (table === 'user_quiz_answers') {
            return Promise.resolve({
              data: [{ quiz_id: 1 }],
              error: null,
            })
          }
          return Promise.resolve({
            data: [{ quiz_id: 1 }, { quiz_id: 2 }],
            error: null,
          })
        },
      }),
    }))

    const { result, rerender } = renderHook(() => useSyncUnansweredQuizIds(1), { wrapper })

    // Wait for initial queries to resolve
    await queryClient.refetchQueries()

    // Re-render with same data
    rerender()

    // Verify the data was only fetched once
    expect(supabase.from).toHaveBeenCalledTimes(2) // Once for each table
  })
})
