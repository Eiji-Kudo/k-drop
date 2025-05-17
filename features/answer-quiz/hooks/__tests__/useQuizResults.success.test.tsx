import { supabase } from '@/utils/supabase'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { useQuizResults } from '../useQuizResults'
import { setupSupabaseMocks } from './mocks/useQuizResultsMocks'

describe('useQuizResults - success case', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
  })

  it('should fetch quiz results data from Supabase correctly', async () => {
    const { mockFrom } = setupSupabaseMocks()
    ;(supabase.from as jest.Mock) = mockFrom

    const { result } = renderHook(() => useQuizResults([1, 2]), { wrapper })

    await waitFor(
      () => {
        expect(result.current.queryResult.isSuccess).toBe(true)
      },
      { timeout: 3000 },
    )

    expect(mockFrom).toHaveBeenCalledWith('user_quiz_answers')
    expect(mockFrom).toHaveBeenCalledWith('quizzes')
    expect(mockFrom).toHaveBeenCalledWith('quiz_choices')

    expect(result.current.queryResult.data).toBeDefined()

    const data = result.current.queryResult.data!
    expect(data.results).toHaveLength(2)

    expect(data.totalScore).toBe(100)
    expect(data.correctCount).toBe(1)

    expect(data.results[0].quiz.quiz_id).toBe(1)
    expect(data.results[0].userAnswer.is_correct).toBe(true)
    expect(data.results[0].choices).toHaveLength(2)

    expect(data.results[1].quiz.quiz_id).toBe(2)
    expect(data.results[1].userAnswer.is_correct).toBe(false)
    expect(data.results[1].choices).toHaveLength(2)
  })
})
