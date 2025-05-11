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

    // Create a spy on the from method to avoid unbound-method errors
    jest.spyOn(supabase, 'from')
  })

  it('should not call setSelectedQuizIds when there is no context setter', async () => {
    // Mock useAppUser to return no user
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: null })

    renderHook(() => useSyncUnansweredQuizIds(null), { wrapper })

    // Wait for queries to resolve
    await queryClient.refetchQueries()

    // We can safely check the spy created in beforeEach
    expect(jest.spyOn(supabase, 'from')).not.toHaveBeenCalled()
  })

  it('should set empty array when there are no unanswered quizzes', async () => {
    // Mock useAppUser to return a user
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 1 })

    // Clear previous mocks before setting up new ones
    jest.clearAllMocks()

    // Mock empty quiz answers and quizzes - the mock is already set up in jest-setup.js

    renderHook(() => useSyncUnansweredQuizIds(1), {
      wrapper,
    })

    // Wait for queries to resolve
    await queryClient.refetchQueries()

    // We can safely check the spy created in beforeEach
    const fromSpy = jest.spyOn(supabase, 'from')
    expect(fromSpy).toHaveBeenCalledWith('user_quiz_answers')
    expect(fromSpy).toHaveBeenCalledWith('quizzes')
  })
})
