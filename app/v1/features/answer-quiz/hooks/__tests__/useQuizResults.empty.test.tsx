import { supabase } from '@/utils/supabase'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { useQuizResults } from '../useQuizResults'

describe('useQuizResults - empty case', () => {
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

  it('should return empty results when no quiz IDs are provided', async () => {
    const mockThen = jest
      .fn()
      .mockImplementation((callback) =>
        Promise.resolve().then(() => callback({ data: [], error: null })),
      )

    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      then: mockThen,
    })

    ;(supabase.from as jest.Mock) = mockFrom

    const { result } = renderHook(() => useQuizResults([]), { wrapper })

    expect(result.current.queryResult.isLoading).toBe(false)

    await result.current.queryResult.refetch()

    await waitFor(() => {
      expect(result.current.queryResult.isSuccess).toBe(true)
    })

    expect(result.current.queryResult.data).toEqual({
      results: [],
      totalScore: 0,
      correctCount: 0,
    })
  })
})
