import { GlobalProvider } from '@/context/GlobalContext'
import { useAppUser } from '@/hooks/useAppUser'
import { supabase } from '@/utils/supabase'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { useSyncUnansweredQuizIds } from '../useSyncUnansweredQuizIds'

jest.mock('@/hooks/useAppUser')

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

    mockFrom.mockReset()
    Object.defineProperty(supabase, 'from', {
      value: mockFrom,
    })
  })

  it('should call setSelectedQuizIds with unanswered quiz IDs', async () => {
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 1 })

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

    await queryClient.refetchQueries()

    expect(mockFrom).toHaveBeenCalledWith('user_quiz_answers')
    expect(mockFrom).toHaveBeenCalledWith('quizzes')
  })

  it('should not update when unanswered quiz IDs remain the same', async () => {
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 1 })

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

    await queryClient.refetchQueries()

    rerender()

    expect(mockFrom).toHaveBeenCalledTimes(2)
  })
})
