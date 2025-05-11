import { GlobalProvider } from '@/context/GlobalContext'
import { useAppUser } from '@/hooks/useAppUser'
import { supabase } from '@/utils/supabase'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { useSyncUnansweredQuizIds } from '../useSyncUnansweredQuizIds'

jest.mock('@/hooks/useAppUser')

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
    jest.spyOn(supabase, 'from')
  })

  it('should call setSelectedQuizIds with unanswered quiz IDs', async () => {
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 1 })
    jest.clearAllMocks()

    renderHook(() => useSyncUnansweredQuizIds(1), {
      wrapper,
    })

    await queryClient.refetchQueries()

    const fromSpy = jest.spyOn(supabase, 'from')
    expect(fromSpy).toHaveBeenCalledWith('user_quiz_answers')
    expect(fromSpy).toHaveBeenCalledWith('quizzes')
  })

  it('should not update when unanswered quiz IDs remain the same', async () => {
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 1 })
    jest.clearAllMocks()

    const { rerender } = renderHook(() => useSyncUnansweredQuizIds(1), {
      wrapper,
    })

    await queryClient.refetchQueries()

    rerender()

    const fromSpy = jest.spyOn(supabase, 'from')
    expect(fromSpy).toHaveBeenCalledTimes(2)
  })
})
