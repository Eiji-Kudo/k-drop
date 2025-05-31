import { render } from '@testing-library/react-native'
import { router } from 'expo-router'
import QuizScreen from '../[quizId]'
import {
  mockNavigation,
  mockQuizId,
  NavigationParent,
} from './mocks/quizNavigationMocks'
import { setupMocks } from './mocks/setupMocks'
import { useNextQuiz } from '@/features/answer-quiz/hooks/useNextQuiz'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


;['@/utils/supabase'].forEach((mod) => jest.mock(mod))
jest.mock('@/hooks/useAppUser', () => ({ useAppUser: jest.fn() }))
jest.mock('@/features/answer-quiz/hooks/useNextQuiz', () => ({
  useNextQuiz: jest.fn(),
}))
jest.mock('@/context/GlobalContext', () => ({ useGlobalContext: jest.fn() }))
jest.mock('@/features/answer-quiz/hooks/useQuizQuery', () => ({
  useQuiz: jest.fn(),
  useQuizChoices: jest.fn(),
}))
jest.mock('@/features/answer-quiz/hooks/useUpdateOtakuPower', () => ({
  useUpdateOtakuPower: jest.fn(() => ({ mutate: jest.fn() })),
}))
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useNavigation: jest.fn(),
  router: { push: jest.fn() },
}))

describe('Quiz Navigation', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(setupMocks)
  afterEach(() => jest.useRealTimers())

  it('handles quiz lifecycle events correctly', () => {
    render(<QuizScreen />, { wrapper })
    const parent = mockNavigation.getParent() as NavigationParent


    expect(parent.setOptions).toHaveBeenCalledWith({
      tabBarStyle: { display: 'none' },
    })


    const { unmount } = render(<QuizScreen />, { wrapper })
    unmount()
    expect(parent.setOptions).toHaveBeenCalledWith({ tabBarStyle: undefined })
  })

  it('handles navigation correctly', () => {
    // Test regular navigation
    router.push(`/quiz-tab/quiz/${mockQuizId + 1}`)
    expect(router.push).toHaveBeenCalledWith(`/quiz-tab/quiz/${mockQuizId + 1}`)

    // Test results page navigation when no more quizzes
    ;(useNextQuiz as jest.Mock).mockReturnValue({
      getNextQuiz: jest.fn().mockReturnValue(null),
    })
    router.push('/quiz-tab/result')
    expect(router.push).toHaveBeenCalledWith('/quiz-tab/result')
  })
})
