import { renderHook, act } from '@testing-library/react-native'
import { supabase } from '@/utils/supabase'
import { useAppUser } from '@/hooks/useAppUser'

// Mock dependencies
jest.mock('@/utils/supabase')
jest.mock('@/hooks/useAppUser')

// Create a custom hook for recording quiz answers
const useQuizRecording = () => {
  const { appUserId } = useAppUser()

  const recordQuizAnswer = async (quizId: number, choiceIndex: number, isCorrect: boolean) => {
    if (!appUserId) {
      console.error('Cannot record answer: app_user_id not found')
      return false
    }

    try {
      await supabase.from('user_quiz_answers').insert({
        app_user_id: appUserId,
        quiz_id: quizId,
        selected_choice: choiceIndex + 1, // Convert to 1-based index
        is_correct: isCorrect,
        answered_at: new Date().toISOString(),
      })
      return true
    } catch (error) {
      console.error('Failed to record quiz answer:', error)
      return false
    }
  }

  return { recordQuizAnswer }
}

describe('Quiz Answer Recording', () => {
  const mockAppUserId = 'user123'
  const mockQuizId = 42
  const mockChoiceIndex = 2
  const mockIsCorrect = true

  beforeEach(() => {
    jest.clearAllMocks()
    // Setup mocks
    ;(useAppUser as jest.Mock).mockReturnValue({
      appUserId: mockAppUserId,
    })
    ;(supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    })
  })

  it('successfully records a quiz answer to the database', async () => {
    const { result } = renderHook(() => useQuizRecording())

    let success = false
    await act(async () => {
      success = await result.current.recordQuizAnswer(
        mockQuizId,
        mockChoiceIndex,
        mockIsCorrect
      )
    })

    // Verify that Supabase was called with correct parameters
    expect(supabase.from).toHaveBeenCalledWith('user_quiz_answers')
    expect(supabase.from('user_quiz_answers').insert).toHaveBeenCalledWith({
      app_user_id: mockAppUserId,
      quiz_id: mockQuizId,
      selected_choice: mockChoiceIndex + 1, // Should be 1-based
      is_correct: mockIsCorrect,
      answered_at: expect.any(String),
    })
    expect(success).toBe(true)
  })

  it('handles error when appUserId is not available', async () => {
    // Override the mock to return null for appUserId
    ;(useAppUser as jest.Mock).mockReturnValue({
      appUserId: null,
    })

    const consoleErrorSpy = jest.spyOn(console, 'error')
    const { result } = renderHook(() => useQuizRecording())

    let success = false
    await act(async () => {
      success = await result.current.recordQuizAnswer(
        mockQuizId,
        mockChoiceIndex,
        mockIsCorrect
      )
    })

    // Verify that error was logged and function returned false
    expect(consoleErrorSpy).toHaveBeenCalledWith('Cannot record answer: app_user_id not found')
    expect(success).toBe(false)
    expect(supabase.from).not.toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })

  it('handles database error when recording quiz answer', async () => {
    // Mock a database error
    const mockError = new Error('Database error')
    ;(supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockRejectedValue(mockError),
    })

    const consoleErrorSpy = jest.spyOn(console, 'error')
    const { result } = renderHook(() => useQuizRecording())

    let success = false
    await act(async () => {
      success = await result.current.recordQuizAnswer(
        mockQuizId,
        mockChoiceIndex,
        mockIsCorrect
      )
    })

    // Verify that error was logged and function returned false
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to record quiz answer:', mockError)
    expect(success).toBe(false)

    consoleErrorSpy.mockRestore()
  })
})