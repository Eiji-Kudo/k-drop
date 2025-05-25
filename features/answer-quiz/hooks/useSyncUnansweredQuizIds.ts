import { useGlobalContext } from '@/context/GlobalContext'
import { Tables } from '@/database.types'
import { useAppUser } from '@/hooks/useAppUser'
import { supabase } from '@/utils/supabase'
import { useMutation } from '@tanstack/react-query'

export function useSyncUnansweredQuizIds() {
  const { setSelectedQuizIds } = useGlobalContext()
  const { appUserId } = useAppUser()

  return useMutation({
    mutationFn: async (idolGroupId: number) => {
      if (!appUserId) {
        throw new Error('User not found')
      }

      const [userAnswersResult, groupQuizzesResult] = await Promise.all([
        supabase
          .from('user_quiz_answers')
          .select('*')
          .eq('app_user_id', appUserId),
        supabase.from('quizzes').select('*').eq('idol_group_id', idolGroupId),
      ])

      if (userAnswersResult.error)
        throw new Error(userAnswersResult.error.message)
      if (groupQuizzesResult.error)
        throw new Error(groupQuizzesResult.error.message)

      const userQuizAnswers: Tables<'user_quiz_answers'>[] =
        userAnswersResult.data
      const groupQuizzes: Tables<'quizzes'>[] = groupQuizzesResult.data

      const answeredQuizIds = userQuizAnswers.map((a) => a.quiz_id)
      const unansweredQuizIds = groupQuizzes
        .filter((quiz) => !answeredQuizIds.includes(quiz.quiz_id))
        .map((quiz) => quiz.quiz_id)

      setSelectedQuizIds(unansweredQuizIds)

      return unansweredQuizIds
    },
  })
}
