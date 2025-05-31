import { renderHook, waitFor } from '@testing-library/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { useSyncUnansweredQuizIds } from '../useSyncUnansweredQuizIds'
import { GlobalProvider } from '@/context/GlobalContext'
import {
  setupMocks,
  createQuizzes,
} from './mocks/useSyncUnansweredQuizIdsMocks'

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
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>{children}</GlobalProvider>
    </QueryClientProvider>
  )
  Wrapper.displayName = 'TestWrapper'
  return Wrapper
}

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
    await waitFor(async () => await result.current.mutateAsync(1))
    expect(result.current.data).toHaveLength(10)
    expect(result.current.data?.every((id) => id >= 1 && id <= 15)).toBe(true)
  })

  it('should return all quizzes if less than 10 available', async () => {
    setupMocks([], createQuizzes(5))
    const { result } = renderHook(() => useSyncUnansweredQuizIds(), {
      wrapper: createWrapper(),
    })
    await waitFor(async () => await result.current.mutateAsync(1))
    expect(result.current.data).toHaveLength(5)
    expect(result.current.data).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]))
  })

  it('should exclude already answered quizzes from the 10 limit', async () => {
    setupMocks(
      [
        { quiz_id: 1, app_user_id: 1 },
        { quiz_id: 3, app_user_id: 1 },
        { quiz_id: 5, app_user_id: 1 },
      ],
      createQuizzes(15),
    )
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
    expect(
      ids?.every((id) =>
        [2, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].includes(id),
      ),
    ).toBe(true)
  })
})
