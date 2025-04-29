import { useGlobalContext } from '@/context/GlobalContext'
import { Tables } from '@/database.types'
import { useQuery } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { useSyncUnansweredQuizIds } from '../useSyncUnansweredQuizIds'

// Mock dependencies
jest.mock('@/context/GlobalContext')
jest.mock('@tanstack/react-query')
jest.mock('@/utils/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  },
}))

// Mock useRef to control the prevUnansweredRef value
const mockRef = { current: [99] } // Initialize with a value that will be different from test data
jest.mock('react', () => {
  const originalReact = jest.requireActual('react')
  return {
    ...originalReact,
    useRef: jest.fn().mockImplementation((initialValue) => mockRef),
    useEffect: jest.fn().mockImplementation((fn) => fn()),
    useMemo: jest.fn().mockImplementation((fn) => fn()),
  }
})

describe('useSyncUnansweredQuizIds', () => {
  const mockSetSelectedQuizIds = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockRef.current = [99] // Reset to a value that will be different from empty array
    ;(useGlobalContext as jest.Mock).mockReturnValue({
      setSelectedQuizIds: mockSetSelectedQuizIds,
    })
  })

  it('should not call setSelectedQuizIds when there is no context setter', () => {
    // Mock useGlobalContext to return undefined setSelectedQuizIds
    ;(useGlobalContext as jest.Mock).mockReturnValue({
      setSelectedQuizIds: undefined,
    })

    // Mock useQuery for user
    ;(useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'user') {
        return { data: { id: 'user-123' } }
      }
      return { data: undefined }
    })

    renderHook(() => useSyncUnansweredQuizIds(1))

    expect(mockSetSelectedQuizIds).not.toHaveBeenCalled()
  })

  it('should set empty array when there are no unanswered quizzes', () => {
    // Mock useQuery implementations
    ;(useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'user') {
        return { data: { id: 'user-123' } }
      }
      if (queryKey[0] === 'user_quiz_answers') {
        return { data: [] }
      }
      if (queryKey[0] === 'quizzes') {
        return { data: [] }
      }
      return { data: undefined }
    })

    renderHook(() => useSyncUnansweredQuizIds(1))

    expect(mockSetSelectedQuizIds).toHaveBeenCalledWith([])
  })

  it('should call setSelectedQuizIds with unanswered quiz IDs', () => {
    const mockUserQuizAnswers: Tables<'user_quiz_answers'>[] = [
      {
        app_user_id: 1,
        quiz_id: 1,
        selected_choice: 2,
        is_correct: true,
        answered_at: '2023-01-01',
        user_quiz_answer_id: 1,
      },
      {
        app_user_id: 1,
        quiz_id: 2,
        selected_choice: 1,
        is_correct: false,
        answered_at: '2023-01-01',
        user_quiz_answer_id: 2,
      },
    ]

    const mockQuizzes: Tables<'quizzes'>[] = [
      {
        quiz_id: 1,
        idol_group_id: 1,
        prompt: 'Q1',
        choice1: 'A',
        choice2: 'B',
        choice3: 'C',
        choice4: 'D',
        correct_choice: 1,
        explanation: 'Explanation 1',
        quiz_difficulty_id: 1,
      },
      {
        quiz_id: 2,
        idol_group_id: 1,
        prompt: 'Q2',
        choice1: 'A',
        choice2: 'B',
        choice3: 'C',
        choice4: 'D',
        correct_choice: 2,
        explanation: 'Explanation 2',
        quiz_difficulty_id: 1,
      },
      {
        quiz_id: 3,
        idol_group_id: 1,
        prompt: 'Q3',
        choice1: 'A',
        choice2: 'B',
        choice3: 'C',
        choice4: 'D',
        correct_choice: 3,
        explanation: 'Explanation 3',
        quiz_difficulty_id: 1,
      },
      {
        quiz_id: 4,
        idol_group_id: 1,
        prompt: 'Q4',
        choice1: 'A',
        choice2: 'B',
        choice3: 'C',
        choice4: 'D',
        correct_choice: 4,
        explanation: 'Explanation 4',
        quiz_difficulty_id: 1,
      },
    ]

    // Mock useQuery implementations
    ;(useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'user') {
        return { data: { id: 'user-123' } }
      }
      if (queryKey[0] === 'user_quiz_answers') {
        return { data: mockUserQuizAnswers }
      }
      if (queryKey[0] === 'quizzes') {
        return { data: mockQuizzes }
      }
      return { data: undefined }
    })

    renderHook(() => useSyncUnansweredQuizIds(1))

    // Should be called with quiz IDs 3 and 4 which are unanswered
    expect(mockSetSelectedQuizIds).toHaveBeenCalledWith([3, 4])
  })

  it('should not update when unanswered quiz IDs remain the same', () => {
    // Set prevUnansweredRef to match what will be returned in this test
    mockRef.current = [2]

    const mockUserQuizAnswers: Tables<'user_quiz_answers'>[] = [
      {
        app_user_id: 1,
        quiz_id: 1,
        selected_choice: 2,
        is_correct: true,
        answered_at: '2023-01-01',
        user_quiz_answer_id: 1,
      },
    ]

    const mockQuizzes: Tables<'quizzes'>[] = [
      {
        quiz_id: 1,
        idol_group_id: 1,
        prompt: 'Q1',
        choice1: 'A',
        choice2: 'B',
        choice3: 'C',
        choice4: 'D',
        correct_choice: 1,
        explanation: 'Explanation 1',
        quiz_difficulty_id: 1,
      },
      {
        quiz_id: 2,
        idol_group_id: 1,
        prompt: 'Q2',
        choice1: 'A',
        choice2: 'B',
        choice3: 'C',
        choice4: 'D',
        correct_choice: 2,
        explanation: 'Explanation 2',
        quiz_difficulty_id: 1,
      },
    ]

    // Mock useQuery implementations
    ;(useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'user') {
        return { data: { id: 'user-123' } }
      }
      if (queryKey[0] === 'user_quiz_answers') {
        return { data: mockUserQuizAnswers }
      }
      if (queryKey[0] === 'quizzes') {
        return { data: mockQuizzes }
      }
      return { data: undefined }
    })

    // First render - should update since prevUnansweredRef.current = [2] is already set
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
