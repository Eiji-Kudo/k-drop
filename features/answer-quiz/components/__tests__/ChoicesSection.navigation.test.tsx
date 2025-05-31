import { fireEvent, render } from '@testing-library/react-native'
import { useQuizNavigation } from '../../hooks/useQuizNavigation'
import { useQuizOnSelect } from '../../hooks/useQuizOnSelect'
import { useQuizChoices } from '../../hooks/useQuizQuery'
import { useGlobalContext } from '@/context/GlobalContext'
import { useAppUser } from '@/hooks/useAppUser'
import { ChoicesSection } from '../ChoicesSection'

jest.mock('@/utils/supabase')
jest.mock('@/hooks/useAppUser', () => ({
  useAppUser: jest.fn(),
}))
jest.mock('@/context/GlobalContext', () => ({
  useGlobalContext: jest.fn(),
}))
jest.mock('../../hooks/useQuizQuery', () => ({
  useQuizChoices: jest.fn(),
}))
jest.mock('../../hooks/useQuizOnSelect', () => ({
  useQuizOnSelect: jest.fn(),
}))
jest.mock('../../hooks/useQuizNavigation', () => ({
  useQuizNavigation: jest.fn(),
}))

const mockQuiz = {
  quiz_id: 1,
  idol_group_id: 1,
  prompt: 'Test Question',
  correct_answer: 'Correct Answer',
  explanation: 'This is the explanation',
  quiz_difficulty_id: 1,
  created_at: new Date().toISOString(),
}

describe('ChoicesSection - Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 1 })
    ;(useGlobalContext as jest.Mock).mockReturnValue({
      selectedQuizChoiceId: null,
      displayPhase: 'answering',
    })
    ;(useQuizChoices as jest.Mock).mockReturnValue({
      data: [
        { quiz_choice_id: 1, quiz_id: 1, choice: 'Option A', display_order: 1 },
        { quiz_choice_id: 2, quiz_id: 1, choice: 'Option B', display_order: 2 },
        { quiz_choice_id: 3, quiz_id: 1, choice: 'Option C', display_order: 3 },
        { quiz_choice_id: 4, quiz_id: 1, choice: 'Option D', display_order: 4 },
      ],
      isLoading: false,
    })
    ;(useQuizOnSelect as jest.Mock).mockReturnValue({
      onSelect: jest.fn(),
    })
  })

  it('handles navigation to results when all quizzes are answered', () => {
    const mockGoNext = jest.fn()
    ;(useQuizNavigation as jest.Mock).mockReturnValue({
      goNext: mockGoNext,
    })

    const { getByTestId } = render(
      <ChoicesSection quiz={mockQuiz} testDisplayPhase="explanation" />,
    )

    fireEvent.press(getByTestId('next-button'))
    expect(mockGoNext).toHaveBeenCalled()
  })
})