import { renderHook } from '@testing-library/react'

import { useGlobalContext } from '@/context/GlobalContext'
import { useNextQuiz } from '../useNextQuiz'

// Mock the GlobalContext
jest.mock('@/context/GlobalContext')

describe('useNextQuiz', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns null when there are no selected quizzes', () => {
    // Setup mock return value for useGlobalContext
    (useGlobalContext as jest.Mock).mockReturnValue({
      selectedQuizIds: [],
      answeredQuizIds: [],
    })

    // Render the hook
    const { result } = renderHook(() => useNextQuiz())
    
    // Get the next quiz
    const nextQuizId = result.current.getNextQuiz()
    
    // Assert that nextQuizId is null
    expect(nextQuizId).toBeNull()
  })

  it('returns the first unanswered quiz ID when there are selected quizzes', () => {
    // Setup mock return value for useGlobalContext
    (useGlobalContext as jest.Mock).mockReturnValue({
      selectedQuizIds: [1, 2, 3],
      answeredQuizIds: [],
    })

    // Render the hook
    const { result } = renderHook(() => useNextQuiz())
    
    // Get the next quiz
    const nextQuizId = result.current.getNextQuiz()
    
    // Assert that nextQuizId is the first selected quiz ID
    expect(nextQuizId).toBe(1)
  })

  it('skips answered quizzes and returns the first unanswered one', () => {
    // Setup mock return value for useGlobalContext
    (useGlobalContext as jest.Mock).mockReturnValue({
      selectedQuizIds: [1, 2, 3, 4],
      answeredQuizIds: [1, 2],
    })

    // Render the hook
    const { result } = renderHook(() => useNextQuiz())
    
    // Get the next quiz
    const nextQuizId = result.current.getNextQuiz()
    
    // Assert that nextQuizId is the first unanswered quiz ID
    expect(nextQuizId).toBe(3)
  })

  it('returns null when all selected quizzes have been answered', () => {
    // Setup mock return value for useGlobalContext
    (useGlobalContext as jest.Mock).mockReturnValue({
      selectedQuizIds: [1, 2, 3],
      answeredQuizIds: [1, 2, 3],
    })

    // Render the hook
    const { result } = renderHook(() => useNextQuiz())
    
    // Get the next quiz
    const nextQuizId = result.current.getNextQuiz()
    
    // Assert that nextQuizId is null when all quizzes are answered
    expect(nextQuizId).toBeNull()
  })

  it('handles when answeredQuizIds contains IDs not in selectedQuizIds', () => {
    // Setup mock return value for useGlobalContext
    (useGlobalContext as jest.Mock).mockReturnValue({
      selectedQuizIds: [3, 4, 5],
      answeredQuizIds: [1, 2, 3],
    })

    // Render the hook
    const { result } = renderHook(() => useNextQuiz())
    
    // Get the next quiz
    const nextQuizId = result.current.getNextQuiz()
    
    // Assert that nextQuizId is the first unanswered quiz from selected IDs
    expect(nextQuizId).toBe(4)
  })
}) 