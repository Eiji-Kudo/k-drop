import { router } from 'expo-router'
import { useNextQuiz } from './useNextQuiz'

export const useQuizNavigation = () => {
  const { getNextQuiz } = useNextQuiz()

  const goNext = () => {
    const next = getNextQuiz()
    router.push(next ? `/quiz-tab/quiz/${next}` : '/quiz-tab/result')
  }

  return { goNext }
}
