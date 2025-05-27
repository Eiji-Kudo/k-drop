import { renderHook, act, waitFor } from '@testing-library/react'
import { useQuizOnSelect } from '../useQuizOnSelect'
import { useAppUser } from '@/hooks/useAppUser'
import { useQuiz, useQuizChoices } from '../useQuizQuery'
import { useUpdateOtakuPower } from '../useUpdateOtakuPower'
import type { Database } from '@/database.types'

jest.mock('@/hooks/useAppUser')
jest.mock('../useQuizQuery')
jest.mock('../useUpdateOtakuPower')
const mockInsert = jest.fn().mockResolvedValue({ data: null, error: null })
const mockFrom = jest.fn(() => ({ insert: mockInsert }))

jest.mock('@/utils/supabase', () => ({
  supabase: {
    from: mockFrom,
  },
}))

type Quiz = Database['public']['Tables']['quizzes']['Row']
type QuizChoice = Database['public']['Tables']['quiz_choices']['Row']

describe('useQuizOnSelect', () => {
  const mockAppUserId = 1
  const mockQuizId = 10
  const mockSetSelectedChoiceId = jest.fn()
  const mockSetDisplayPhase = jest.fn()
  const mockUpdateOtakuPower = jest.fn()

  const mockQuizData: Quiz = {
    quiz_id: mockQuizId,
    idol_group_id: 2,
    quiz_difficulty_id: 2,
    prompt: 'Test question',
    explanation: 'Test explanation',
  }

  const mockChoices: QuizChoice[] = [
    {
      quiz_choice_id: 101,
      quiz_id: mockQuizId,
      choice_text: 'Wrong answer',
      is_correct: false,
    },
    {
      quiz_choice_id: 102,
      quiz_id: mockQuizId,
      choice_text: 'Correct answer',
      is_correct: true,
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    ;(useAppUser as jest.Mock).mockReturnValue({
      appUserId: mockAppUserId,
    })
    ;(useQuiz as jest.Mock).mockReturnValue({
      data: mockQuizData,
    })
    ;(useQuizChoices as jest.Mock).mockReturnValue({
      data: mockChoices,
    })
    ;(useUpdateOtakuPower as jest.Mock).mockReturnValue({
      updateOtakuPower: mockUpdateOtakuPower,
      isUpdating: false,
    })

    mockUpdateOtakuPower.mockResolvedValue({
      success: true,
      scoreAdded: 150,
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should handle quiz answer selection correctly', async () => {
    const { result } = renderHook(() =>
      useQuizOnSelect(mockQuizId, mockSetSelectedChoiceId, mockSetDisplayPhase),
    )

    await act(async () => {
      await result.current.onSelect(1) // Select correct answer
    })

    expect(mockSetSelectedChoiceId).toHaveBeenCalledWith(102)
    expect(mockFrom).toHaveBeenCalledWith('user_quiz_answers')
    expect(mockInsert).toHaveBeenCalledWith({
      app_user_id: mockAppUserId,
      quiz_id: mockQuizId,
      selected_choice: 2, // index + 1
      is_correct: true,
      answered_at: expect.any(String),
    })

    act(() => {
      jest.advanceTimersByTime(600)
    })
    expect(mockSetDisplayPhase).toHaveBeenCalledWith('result')

    act(() => {
      jest.advanceTimersByTime(1400)
    })
    expect(mockSetDisplayPhase).toHaveBeenCalledWith('explanation')
  })

  it('should not save answer when user is not logged in', async () => {
    ;(useAppUser as jest.Mock).mockReturnValue({
      appUserId: null,
    })

    const { result } = renderHook(() =>
      useQuizOnSelect(mockQuizId, mockSetSelectedChoiceId, mockSetDisplayPhase),
    )

    await act(async () => {
      await result.current.onSelect(1)
    })

    // Should not call Supabase insert when user is not logged in
    expect(mockFrom).not.toHaveBeenCalled()
    expect(mockInsert).not.toHaveBeenCalled()
  })
})
