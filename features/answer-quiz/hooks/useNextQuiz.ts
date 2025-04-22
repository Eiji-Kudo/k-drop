import { useGlobalContext } from '@/context/GlobalContext'

/**
 * Hook that provides the ability to get the next quiz ID and manage quiz queue
 */
export const useNextQuiz = () => {
  const { selectedQuizIds, setSelectedQuizIds } = useGlobalContext()

  const getNextQuiz = () => {
    if (selectedQuizIds.length === 0) {
      return null
    }

    const [nextQuizId, ...remaining] = selectedQuizIds
    setSelectedQuizIds(remaining)

    return nextQuizId
  }

  return {
    getNextQuiz,
    hasQuizzes: selectedQuizIds.length > 0,
  }
}
