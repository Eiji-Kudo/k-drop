import { useAppUser } from '@/hooks/useAppUser'
import { supabase } from '@/utils/supabase'
import { fireEvent, render } from '@testing-library/react-native'
import { router } from 'expo-router'
import { useNextQuiz } from '../../hooks/useNextQuiz'
import { useQuizChoices } from '../../hooks/useQuizQuery'
import { ChoicesSection } from '../ChoicesSection'

// Mock dependencies
jest.mock('../../hooks/useQuizQuery')
jest.mock('../../hooks/useNextQuiz')
jest.mock('@/hooks/useAppUser')
jest.mock('@/utils/supabase')
jest.mock('@/components/ui/button/PrimaryButton', () => {
  const reactNative = require('react-native')
  return {
    PrimaryButton: ({ children, onPress }: { children: React.ReactNode, onPress: () => void }) => (
      <reactNative.Pressable testID="next-button" data-testid="next-button" onPress={onPress}>
        <reactNative.Text>{children}</reactNative.Text>
      </reactNative.Pressable>
    )
  }
})
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}))

describe('ChoicesSection', () => {
  // Mock data
  const mockQuiz = {
    quiz_id: 1,
    prompt: 'Test Question',
    explanation: 'This is the explanation',
    idol_group_id: 1,
    quiz_difficulty_id: 1,
  }

  const mockChoices = [
    {
      quiz_choice_id: 101,
      quiz_id: 1,
      choice_text: 'Option A',
      is_correct: true,
    },
    {
      quiz_choice_id: 102,
      quiz_id: 1,
      choice_text: 'Option B',
      is_correct: false,
    },
    {
      quiz_choice_id: 103,
      quiz_id: 1,
      choice_text: 'Option C',
      is_correct: false,
    },
    {
      quiz_choice_id: 104,
      quiz_id: 1,
      choice_text: 'Option D',
      is_correct: false,
    },
  ]

  // Setup mocks
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock hooks
    ;(useQuizChoices as jest.Mock).mockReturnValue({
      data: mockChoices,
    })
    ;(useNextQuiz as jest.Mock).mockReturnValue({
      getNextQuiz: jest.fn().mockReturnValue(2),
    })
    ;(useAppUser as jest.Mock).mockReturnValue({
      appUserId: 'user123',
    })
    ;(supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    })

    // Mock setTimeout
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders all quiz choices correctly', () => {
    const { getAllByTestId } = render(<ChoicesSection quiz={mockQuiz} />)
    
    // Check if all choice buttons are rendered
    const choiceButtons = getAllByTestId('quiz-choice')
    expect(choiceButtons.length).toBe(4)
    
    // Verify choice texts (formatted as "1. Option A")
    expect(choiceButtons[0]).toHaveTextContent('1. Option A')
    expect(choiceButtons[1]).toHaveTextContent('2. Option B')
    expect(choiceButtons[2]).toHaveTextContent('3. Option C')
    expect(choiceButtons[3]).toHaveTextContent('4. Option D')
  })

  it('shows explanation and next button when in explanation phase', () => {
    const { getByTestId } = render(
      <ChoicesSection quiz={mockQuiz} testDisplayPhase="explanation" />
    )
    
    const explanation = getByTestId('explanation-container')
    const nextButton = getByTestId('next-button')
    expect(explanation).toBeTruthy()
    expect(nextButton).toBeTruthy()
  })

  it('disables choices after selection', () => {
    const { getAllByTestId } = render(<ChoicesSection quiz={mockQuiz} />)
    
    // Select the first choice
    const choiceButtons = getAllByTestId('quiz-choice')
    fireEvent.press(choiceButtons[0])
    
    // Try to select another choice (should be disabled)
    fireEvent.press(choiceButtons[1])
    
    // Check that supabase insert was called only once
    expect(supabase.from('user_quiz_answers').insert).toHaveBeenCalledTimes(1)
  })

  it('navigates to next quiz when "次へ" button is pressed', () => {
    const { getByTestId } = render(
      <ChoicesSection quiz={mockQuiz} testDisplayPhase="explanation" />
    )

    const nextButton = getByTestId('next-button')
    fireEvent.press(nextButton)
    expect(router.push).toHaveBeenCalledWith('/quiz-tab/quiz/2')
  })

  it('navigates to results page when no more quizzes are available', () => {
    // Mock getNextQuiz to return null (no more quizzes)
    ;(useNextQuiz as jest.Mock).mockReturnValue({
      getNextQuiz: jest.fn().mockReturnValue(null),
    })

    const { getByTestId } = render(
      <ChoicesSection quiz={mockQuiz} testDisplayPhase="explanation" />
    )

    const nextButton = getByTestId('next-button')
    fireEvent.press(nextButton)
    expect(router.push).toHaveBeenCalledWith('/quiz-tab/result')
  })
})
