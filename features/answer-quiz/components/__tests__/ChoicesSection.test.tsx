import { useAppUser } from '@/hooks/useAppUser'
import { supabase } from '@/utils/supabase'
import { fireEvent, render } from '@testing-library/react-native'
import { router } from 'expo-router'
import { useNextQuiz } from '../../hooks/useNextQuiz'
import { useQuizChoices } from '../../hooks/useQuizQuery'
import { ChoicesSection } from '../ChoicesSection'

const mocks = ['@/utils/supabase']
mocks.forEach((mod) => jest.mock(mod))
jest.mock('@/hooks/useAppUser', () => ({
  useAppUser: jest.fn(),
}))
jest.mock('../../hooks/useQuizQuery', () => ({
  useQuizChoices: jest.fn(),
}))
jest.mock('../../hooks/useNextQuiz', () => ({
  useNextQuiz: jest.fn(),
}))
jest.mock('expo-router', () => ({ router: { push: jest.fn() } }))
jest.mock('@/components/ui/button/PrimaryButton', () => ({
  PrimaryButton: (props: {
    children: React.ReactNode
    onPress: () => void
  }) => {
    const RN = require('react-native')
    const pressHandler = () => props.onPress()
    return (
      <RN.Pressable
        testID="next-button"
        data-testid="next-button"
        onPress={pressHandler}
      >
        <RN.Text>{props.children}</RN.Text>
      </RN.Pressable>
    )
  },
}))

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
    ;(useNextQuiz as jest.Mock).mockReturnValue({
      getNextQuiz: jest.fn().mockReturnValue(2),
    })
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 'user123' })

    const mockInsert = jest.fn().mockResolvedValue({ data: null, error: null })
    ;(supabase.from as jest.Mock).mockReturnValue({
      insert: mockInsert,
    })

    jest.useFakeTimers()
  })

  afterEach(() => jest.useRealTimers())

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

  it('handles navigation correctly', () => {
    const { getByTestId } = render(
      <ChoicesSection quiz={mockQuiz} testDisplayPhase="explanation" />,
    )
    const pressNext = () => fireEvent.press(getByTestId('next-button'))
    pressNext()
    expect(router.push).toHaveBeenCalledWith('/quiz-tab/quiz/2')

    ;(useNextQuiz as jest.Mock).mockReturnValue({
      getNextQuiz: jest.fn().mockReturnValue(null),
    })
    const { getByTestId: getResultsButton } = render(
      <ChoicesSection quiz={mockQuiz} testDisplayPhase="explanation" />,
    )
    const pressButton = () => fireEvent.press(getResultsButton('next-button'))
    pressButton()
    expect(router.push).toHaveBeenCalledWith('/quiz-tab/result')
  })
})
