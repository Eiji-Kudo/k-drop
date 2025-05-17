import { supabase } from '@/utils/supabase'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { useQuizResults } from '../useQuizResults'

describe('useQuizResults - error case', () => {
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

  it('should handle Supabase error gracefully', async () => {
    const errorMessage = 'Database connection error'

    const mockThen = jest.fn().mockImplementation((callback) =>
      Promise.resolve().then(() =>
        callback({
          data: null,
          error: new Error(errorMessage),
        }),
      ),
    )

    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      then: mockThen,
    })

    ;(supabase.from as jest.Mock) = mockFrom

    const { result } = renderHook(() => useQuizResults([1, 2]), { wrapper })

    await waitFor(() => {
      expect(result.current.queryResult.isError).toBe(true)
    })

    expect(result.current.queryResult.error).toBeDefined()
  })
})
