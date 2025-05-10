import { renderHook } from '@testing-library/react'
import { useSyncUnansweredQuizIds } from '../useSyncUnansweredQuizIds'
import { mockRef, setupQueryMocks } from './mocks/syncUnansweredQuizIdsMocks'

// Setup mocks
jest.mock('@/context/GlobalContext')
jest.mock('@tanstack/react-query')

// Mock useRef to control the prevUnansweredRef value
jest.mock('react', () => {
  const originalReact = jest.requireActual('react')
  return {
    ...originalReact,
    useRef: jest.fn().mockImplementation(() => mockRef),
    useEffect: jest.fn().mockImplementation((fn) => fn()),
    useMemo: jest.fn().mockImplementation((fn) => fn()),
  }
})

describe('useSyncUnansweredQuizIds', () => {
  const mockSetSelectedQuizIds = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockRef.current = [99] // Reset to a value that will be different from empty array
  })

  it('should not call setSelectedQuizIds when there is no context setter', () => {
    // Mock GlobalContext with undefined setSelectedQuizIds
    setupQueryMocks(undefined as any, { withUserOnly: true })

    renderHook(() => useSyncUnansweredQuizIds(1))

    expect(mockSetSelectedQuizIds).not.toHaveBeenCalled()
  })

  it('should set empty array when there are no unanswered quizzes', () => {
    // Setup with no quiz answers and no quizzes
    setupQueryMocks(mockSetSelectedQuizIds, {
      withUserAnswers: false,
      withQuizzes: false,
    })

    renderHook(() => useSyncUnansweredQuizIds(1))

    expect(mockSetSelectedQuizIds).toHaveBeenCalledWith([])
  })

  it('should call setSelectedQuizIds with unanswered quiz IDs', () => {
    // Setup with default quiz answers and quizzes
    setupQueryMocks(mockSetSelectedQuizIds)

    renderHook(() => useSyncUnansweredQuizIds(1))

    // Should be called with quiz IDs 3 and 4 which are unanswered
    expect(mockSetSelectedQuizIds).toHaveBeenCalledWith([3, 4])
  })

  it('should not update when unanswered quiz IDs remain the same', () => {
    // Set prevUnansweredRef to match what will be returned in this test
    mockRef.current = [2]

    // Setup with limited quiz set and single answer
    setupQueryMocks(mockSetSelectedQuizIds, {
      limitedQuizzes: true,
      singleAnswer: true,
    })

    // First render - should not update since prevUnansweredRef.current already equals [2]
    renderHook(() => useSyncUnansweredQuizIds(1))

    // Since prevUnansweredRef.current already equals [2], it shouldn't call setSelectedQuizIds
    expect(mockSetSelectedQuizIds).not.toHaveBeenCalled()

    // Now simulate a different prevUnansweredRef value to test it does update
    mockRef.current = [99]

    // Re-render with same data but different prevUnansweredRef
    renderHook(() => useSyncUnansweredQuizIds(1))

    // Now it should update
    expect(mockSetSelectedQuizIds).toHaveBeenCalledWith([2])
  })
})
