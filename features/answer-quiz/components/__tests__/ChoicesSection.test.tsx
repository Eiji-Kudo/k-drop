import { useGlobalContext } from '@/context/GlobalContext'
import { useAppUser } from '@/hooks/useAppUser'
import { supabase } from '@/utils/supabase'
import { render } from '@testing-library/react-native'
import { useQuizChoices, useQuiz } from '../../hooks/useQuizQuery'
import { useUpdateOtakuPower } from '../../hooks/useUpdateOtakuPower'
import { useQuizOnSelect } from '../../hooks/useQuizOnSelect'
import { useQuizNavigation } from '../../hooks/useQuizNavigation'
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
  useQuiz: jest.fn(),
}))
jest.mock('../../hooks/useUpdateOtakuPower', () => ({
  useUpdateOtakuPower: jest.fn(),
}))
jest.mock('../../hooks/useQuizOnSelect', () => ({
  useQuizOnSelect: jest.fn(),
}))
jest.mock('../../hooks/useQuizNavigation', () => ({
  useQuizNavigation: jest.fn(),
}))
jest.mock('expo-router', () => ({ router: { push: jest.fn() } }))

describe('ChoicesSection', () => {
  const mockQuiz = {
    quiz_id: 1,
    prompt: 'Test Question',
    explanation: 'This is the explanation',
    idol_group_id: 1,
    quiz_difficulty_id: 1,
  }
  const mockChoices = Array.from({ length: 4 }, (_, i) => ({
    quiz_choice_id: 101 + i,
    quiz_id: 1,
    choice_text: `Option ${String.fromCharCode(65 + i)}`,
    is_correct: i === 0,
  }))

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useQuizChoices as jest.Mock).mockReturnValue({ data: mockChoices })
    ;(useQuizOnSelect as jest.Mock).mockReturnValue({
      onSelect: jest.fn(),
    })
    ;(useQuizNavigation as jest.Mock).mockReturnValue({
      goNext: jest.fn(),
    })
    ;(useQuiz as jest.Mock).mockReturnValue({ data: mockQuiz })
    ;(useUpdateOtakuPower as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
    })
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 'user123' })
    ;(useGlobalContext as jest.Mock).mockReturnValue({
      selectedQuizIds: [1, 2, 3],
      answeredQuizIds: [],
    })

    const mockInsert = jest.fn().mockResolvedValue({ data: null, error: null })
    ;(supabase.from as jest.Mock).mockReturnValue({
      insert: mockInsert,
    })

    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('renders content and handles user interactions correctly', () => {
    const { getAllByTestId } = render(<ChoicesSection quiz={mockQuiz} />)
    const choiceButtons = getAllByTestId('quiz-choice')
    expect(choiceButtons.length).toBe(4)
    expect(choiceButtons[0]).toHaveTextContent('1. Option A')

    const { getByTestId } = render(
      <ChoicesSection quiz={mockQuiz} testDisplayPhase="explanation" />,
    )
    expect(getByTestId('explanation-container')).toBeTruthy()
  })

})
