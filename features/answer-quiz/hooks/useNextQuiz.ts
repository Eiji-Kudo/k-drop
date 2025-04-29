import { useGlobalContext } from '@/context/GlobalContext'

/**
 * Hook that provides the ability to get the next quiz ID and manage quiz queue
 */
export const useNextQuiz = () => {
  const { selectedQuizIds, answeredQuizIds } = useGlobalContext()

  const getNextQuiz = () => {
    if (selectedQuizIds.length === 0) {
      return null
    }

    // selectedQuizIdsからansweredQuizIdsを除いた配列を作成
    const remainingQuizIds = selectedQuizIds.filter(
      (id) => !answeredQuizIds.includes(id),
    )

    const nextQuizId = remainingQuizIds[0]

    return nextQuizId
  }

  return {
    getNextQuiz,
  }
}
