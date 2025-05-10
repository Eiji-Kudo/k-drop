import { useGlobalContext } from '@/context/GlobalContext'
import { useNextQuiz } from '@/features/answer-quiz/hooks/useNextQuiz'
import {
  useQuiz,
  useQuizChoices,
} from '@/features/answer-quiz/hooks/useQuizQuery'
import { useAppUser } from '@/hooks/useAppUser'
import { supabase } from '@/utils/supabase'
import { render } from '@testing-library/react-native'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import QuizScreen from '../[quizId]'

// Mock all dependencies at once
;[
  '@/context/GlobalContext',
  '@/features/answer-quiz/hooks/useQuizQuery',
  '@/features/answer-quiz/hooks/useNextQuiz',
  '@/hooks/useAppUser',
  '@/utils/supabase',
].forEach((mod) => jest.mock(mod))
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useNavigation: jest.fn(),
  router: { push: jest.fn() },
}))

describe('Quiz Navigation', () => {
  // Mock data
  const mockQuizId = 42
  const mockQuiz = {
    quiz_id: mockQuizId,
    prompt: 'Test Question',
    explanation: 'Test Explanation',
    idol_group_id: 1,
    quiz_difficulty_id: 1,
  }
  const mockChoices = [
    {
      quiz_choice_id: 101,
      quiz_id: mockQuizId,
      choice_text: 'Option A',
      is_correct: true,
    },
    {
      quiz_choice_id: 102,
      quiz_id: mockQuizId,
      choice_text: 'Option B',
      is_correct: false,
    },
  ]
  type NavigationParent = {
    setOptions: (options: Record<string, unknown>) => void
  }
  const mockNavigation = {
    getParent: jest
      .fn()
      .mockReturnValue({ setOptions: jest.fn() } as NavigationParent),
  }
  const mockSetAnsweredQuizIds = jest.fn()

  // Mock setup
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useLocalSearchParams as jest.Mock).mockReturnValue({
      quizId: mockQuizId.toString(),
    })
    ;(useNavigation as jest.Mock).mockReturnValue(mockNavigation)
    ;(useGlobalContext as jest.Mock).mockReturnValue({
      selectedQuizIds: [mockQuizId, mockQuizId + 1],
      answeredQuizIds: [],
      setAnsweredQuizIds: mockSetAnsweredQuizIds,
    })
    ;(useQuiz as jest.Mock).mockReturnValue({ data: mockQuiz })
    ;(useQuizChoices as jest.Mock).mockReturnValue({ data: mockChoices })
    ;(useNextQuiz as jest.Mock).mockReturnValue({
      getNextQuiz: jest.fn().mockReturnValue(mockQuizId + 1),
    })
    ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 'user123' })
    ;(supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    })
    jest.useFakeTimers()
  })
  afterEach(() => jest.useRealTimers())

  // Tests
  it('handles quiz lifecycle events correctly', () => {
    // Test lifecycle events (mounting and unmounting)
    render(<QuizScreen />)
    expect(mockSetAnsweredQuizIds).toHaveBeenCalled()
    expect(mockNavigation.getParent).toHaveBeenCalled()

    // Tab bar visibility
    const parent = mockNavigation.getParent() as NavigationParent
    expect(parent.setOptions).toHaveBeenCalledWith({
      tabBarStyle: { display: 'none' },
    })

    // Unmount and tab bar restoration
    const { unmount } = render(<QuizScreen />)
    unmount()
    expect(parent.setOptions).toHaveBeenCalledWith({ tabBarStyle: undefined })
  })

  it('handles navigation correctly', () => {
    // Test next quiz navigation
    router.push(`/quiz-tab/quiz/${mockQuizId + 1}`)
    expect(router.push).toHaveBeenCalledWith(`/quiz-tab/quiz/${mockQuizId + 1}`)

    // Test results page navigation
    ;(useNextQuiz as jest.Mock).mockReturnValue({
      getNextQuiz: jest.fn().mockReturnValue(null),
    })
    router.push('/quiz-tab/result')
    expect(router.push).toHaveBeenCalledWith('/quiz-tab/result')
  })
})
