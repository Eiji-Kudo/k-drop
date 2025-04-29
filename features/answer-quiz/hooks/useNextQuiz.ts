import { useGlobalContext } from '@/context/GlobalContext'

/**
 * Hook that provides the ability to get the next quiz ID and manage quiz queue
 */
export const useNextQuiz = () => {
  const { selectedQuizIds, answeredQuizIds } = useGlobalContext()

  const getNextQuiz = () => {
    const remainingQuizIds = selectedQuizIds.filter(
      (id) => !answeredQuizIds.includes(id),
    );
    return remainingQuizIds.length ? remainingQuizIds[0] : null;
  }

  return {
    getNextQuiz,
  }
}
