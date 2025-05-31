import { renderHook, waitFor } from '@testing-library/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { useSyncUnansweredQuizIds } from '../useSyncUnansweredQuizIds'
import { GlobalProvider } from '@/context/GlobalContext'
import { supabase } from '@/utils/supabase'

jest.mock('@/utils/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

jest.mock('@/hooks/useAppUser', () => ({
  useAppUser: () => ({ appUserId: 1 }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>{children}</GlobalProvider>
    </QueryClientProvider>
  )
  Wrapper.displayName = 'TestWrapper'
  return Wrapper
}

const setupMocks = (userAnswers: any[], quizzes: any[]) => {
  ;(supabase.from as jest.Mock).mockImplementation((table: string) => ({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({
        data: table === 'user_quiz_answers' ? userAnswers : quizzes,
        error: null,
      }),
    }),
  }))
}

const createQuizzes = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    quiz_id: i + 1,
    idol_group_id: 1,
    prompt: `Quiz ${i + 1}`,
    correct_answer: `Answer ${i + 1}`,
    created_at: new Date().toISOString(),
  }))

describe('useSyncUnansweredQuizIds', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.defineProperty(globalThis, '__DEV__', {
      value: false,
      writable: true,
    })
  })

  it('should limit quiz selection to maximum 10 questions', async () => {
    setupMocks([], createQuizzes(15))
    const { result } = renderHook(() => useSyncUnansweredQuizIds(), {
      wrapper: createWrapper(),
    })
    await waitFor(async () => {
      await result.current.mutateAsync(1)
    })
    expect(result.current.data).toHaveLength(10)
    const allQuizIds = Array.from({ length: 15 }, (_, i) => i + 1)
    expect(result.current.data?.every((id) => allQuizIds.includes(id))).toBe(
      true,
    )
  })

  it('should return all quizzes if less than 10 available', async () => {
    setupMocks([], createQuizzes(5))
    const { result } = renderHook(() => useSyncUnansweredQuizIds(), {
      wrapper: createWrapper(),
    })
    await waitFor(async () => {
      await result.current.mutateAsync(1)
    })
    expect(result.current.data).toHaveLength(5)
    expect(result.current.data).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]))
  })

  it('should exclude already answered quizzes from the 10 limit', async () => {
    const mockAnsweredQuizzes = [
      { quiz_id: 1, app_user_id: 1 },
      { quiz_id: 3, app_user_id: 1 },
      { quiz_id: 5, app_user_id: 1 },
    ]
    setupMocks(mockAnsweredQuizzes, createQuizzes(15))
    const { result } = renderHook(() => useSyncUnansweredQuizIds(), {
      wrapper: createWrapper(),
    })
    await waitFor(async () => {
      await result.current.mutateAsync(1)
    })
    const ids = result.current.data
    expect(ids).toHaveLength(10)
    expect(ids).not.toContain(1)
    expect(ids).not.toContain(3)
    expect(ids).not.toContain(5)
    const expectedPossibleIds = [2, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    expect(ids?.every((id) => expectedPossibleIds.includes(id))).toBe(true)
  })
})
