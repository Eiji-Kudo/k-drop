import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { router } from 'expo-router'
import GroupSelectionScreen from '../index'
import { mockSupabaseData, type MockData } from './mocks/groupSelectionMocks'
import {
  TestWrapper,
  globalContextValue,
  resetGlobalContext,
} from './testUtils'

global.setImmediate =
  global.setImmediate ||
  ((fn: (...args: unknown[]) => void, ...args: unknown[]) =>
    global.setTimeout(fn, 0, ...args))

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}))

jest.mock('@/hooks/useAppUser', () => ({
  useAppUser: jest.fn().mockReturnValue({
    appUserId: 1,
    loading: false,
    error: null,
    authUser: { id: 'test-user-id' },
  }),
}))

jest.mock('@/utils/supabase', () => ({
  supabase: {
    from: jest.fn((table: keyof MockData) => ({
      select: jest.fn(() => ({
        eq: jest.fn(() =>
          Promise.resolve({
            data:
              table === 'quizzes'
                ? mockSupabaseData[table].filter(
                    (item) => item.idol_group_id === 1,
                  )
                : mockSupabaseData[table] || [],
            error: null,
          }),
        ),
        data: mockSupabaseData[table] || [],
        error: null,
      })),
    })),
  },
}))

describe('GroupSelectionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetGlobalContext()
  })

  it('should navigate to quiz when quiz IDs are available', async () => {
    const { getByText } = render(<GroupSelectionScreen />, {
      wrapper: TestWrapper,
    })

    await waitFor(() => {
      expect(getByText('TWICE')).toBeTruthy()
    })

    fireEvent.press(getByText('TWICE'))

    const button = getByText('問題へ進む')
    fireEvent.press(button)

    await waitFor(() => {
      expect(globalContextValue?.selectedQuizIds).toBeInstanceOf(Array)
      expect(globalContextValue?.selectedQuizIds).toHaveLength(5)

      expect(
        globalContextValue?.selectedQuizIds?.every((id) =>
          [1, 2, 3, 4, 5].includes(id),
        ),
      ).toBe(true)
      expect(globalContextValue?.answeredQuizIds).toEqual([])
    })

    await waitFor(
      () => {
        expect(router.push).toHaveBeenCalled()
      },
      { timeout: 3000 },
    )

    expect(router.push).toHaveBeenCalledWith(
      expect.stringMatching(/^\/quiz-tab\/quiz\/\d+$/),
    )
  })

  it('should not navigate when no quizzes are available', async () => {
    mockSupabaseData.quizzes = []

    const { getByText } = render(<GroupSelectionScreen />, {
      wrapper: TestWrapper,
    })

    await waitFor(() => {
      expect(getByText('TWICE')).toBeTruthy()
    })

    fireEvent.press(getByText('TWICE'))

    const button = getByText('問題へ進む')
    fireEvent.press(button)

    await waitFor(() => {
      expect(globalContextValue?.selectedQuizIds).toEqual([])
    })

    expect(router.push).not.toHaveBeenCalled()
  })
})
