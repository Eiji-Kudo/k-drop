import { renderHook, act, waitFor } from '@testing-library/react'
import { useQuizOnSelect } from '../useQuizOnSelect'
import { useAppUser } from '@/hooks/useAppUser'
import { useQuiz, useQuizChoices } from '../useQuizQuery'
import { useUpdateOtakuPower } from '../useUpdateOtakuPower'
import type { Database } from '@/database.types'

jest.mock('@/hooks/useAppUser')
jest.mock('../useQuizQuery')
jest.mock('../useUpdateOtakuPower')

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
      mutateAsync: mockUpdateOtakuPower,
      isPending: false,
    })

    mockUpdateOtakuPower.mockResolvedValue({
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

    await waitFor(() => {
      expect(mockUpdateOtakuPower).toHaveBeenCalledWith({
        userId: mockAppUserId,
        quizId: mockQuizId,
        groupId: 2,
        difficultyId: 2,
        isCorrect: true,
        choiceIndex: 1,
      })
    })
  })
})
