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

      const { userQuizAnswers, groupQuizzes } =
        await fetchUserAnswersAndGroupQuizzes(appUserId, idolGroupId)

      const unansweredQuizIds = calculateUnansweredQuizIds(
        userQuizAnswers,
        groupQuizzes,
      )

      setSelectedQuizIds(unansweredQuizIds)

      return unansweredQuizIds
    },
  })
}

async function fetchUserAnswersAndGroupQuizzes(
  appUserId: number,
  idolGroupId: number,
) {
  const [userAnswersResult, groupQuizzesResult] = await Promise.all([
    supabase.from('user_quiz_answers').select('*').eq('app_user_id', appUserId),
    supabase.from('quizzes').select('*').eq('idol_group_id', idolGroupId),
  ])

  if (userAnswersResult.error) throw new Error(userAnswersResult.error.message)
  if (groupQuizzesResult.error)
    throw new Error(groupQuizzesResult.error.message)

  return {
    userQuizAnswers: userAnswersResult.data as Tables<'user_quiz_answers'>[],
    groupQuizzes: groupQuizzesResult.data as Tables<'quizzes'>[],
  }
}

function calculateUnansweredQuizIds(
  userQuizAnswers: Tables<'user_quiz_answers'>[],
  groupQuizzes: Tables<'quizzes'>[],
) {
  const answeredQuizIds = userQuizAnswers.map((a) => a.quiz_id)
  return groupQuizzes
    .filter((quiz) => !answeredQuizIds.includes(quiz.quiz_id))
    .map((quiz) => quiz.quiz_id)
}
