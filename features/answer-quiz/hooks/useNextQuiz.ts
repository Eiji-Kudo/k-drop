import { useGlobalContext } from '@/context/GlobalContext'

export const useNextQuiz = () => {
  const { selectedQuizIds, answeredQuizIds } = useGlobalContext()

  const getNextQuiz = () => {
    const remainingQuizIds = selectedQuizIds.filter(
      (id) => !answeredQuizIds.includes(id),
    )
    return remainingQuizIds.length ? remainingQuizIds[0] : null
  }

  return {
    getNextQuiz,
  }
}
