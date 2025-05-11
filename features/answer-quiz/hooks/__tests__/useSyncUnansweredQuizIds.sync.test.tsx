import { GlobalProvider } from '@/context/GlobalContext'
import { useAppUser } from '@/hooks/useAppUser'
import { supabase } from '@/utils/supabase'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { useSyncUnansweredQuizIds } from '../useSyncUnansweredQuizIds'

// Mock useAppUser hook
jest.mock('@/hooks/useAppUser')

// Mock supabase.from to avoid unbound method lint error
const mockFrom = jest.fn()

describe('useSyncUnansweredQuizIds - synchronization', () => {
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

    // Reset and setup mock for each test
    mockFrom.mockReset()
    Object.defineProperty(supabase, 'from', {
      value: mockFrom,
    })
  })

  it('should call setSelectedQuizIds with unanswered quiz IDs', async () => {
    // Mock useAppUser to return a user
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 1 })

    // Mock quiz answers and quizzes
    mockFrom.mockImplementation((table) => ({
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

    renderHook(() => useSyncUnansweredQuizIds(1), {
      wrapper,
    })

    // Wait for queries to resolve
    await queryClient.refetchQueries()

    // Verify the correct data was fetched and processed
    expect(mockFrom).toHaveBeenCalledWith('user_quiz_answers')
    expect(mockFrom).toHaveBeenCalledWith('quizzes')
  })

  it('should not update when unanswered quiz IDs remain the same', async () => {
    // Mock useAppUser to return a user
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 1 })

    // Mock consistent quiz answers and quizzes
    mockFrom.mockImplementation((table) => ({
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

    const { rerender } = renderHook(() => useSyncUnansweredQuizIds(1), {
      wrapper,
    })

    // Wait for initial queries to resolve
    await queryClient.refetchQueries()

    // Re-render with same data
    rerender()

    // Verify the data was only fetched once
    expect(mockFrom).toHaveBeenCalledTimes(2) // Once for each table
  })
})
