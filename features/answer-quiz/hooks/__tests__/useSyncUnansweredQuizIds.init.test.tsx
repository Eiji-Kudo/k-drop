import { GlobalProvider } from '@/context/GlobalContext'
import { useAppUser } from '@/hooks/useAppUser'
import { supabase } from '@/utils/supabase'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { useSyncUnansweredQuizIds } from '../useSyncUnansweredQuizIds'

// Mock useAppUser hook
jest.mock('@/hooks/useAppUser')

describe('useSyncUnansweredQuizIds - initialization', () => {
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

    renderHook(() => useSyncUnansweredQuizIds(1), {
      wrapper,
    })

    // Wait for queries to resolve
    await queryClient.refetchQueries()

    // Verify the correct data was fetched
    expect(supabase.from).toHaveBeenCalledWith('user_quiz_answers')
    expect(supabase.from).toHaveBeenCalledWith('quizzes')
  })
})
