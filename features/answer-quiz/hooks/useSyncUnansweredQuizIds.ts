import { useGlobalContext } from '@/context/GlobalContext'
import { Tables } from '@/database.types'
import { useAppUser } from '@/hooks/useAppUser'
import { supabase } from '@/utils/supabase'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef } from 'react'

export function useSyncUnansweredQuizIds(idolGroupId: number | null) {
  const { setSelectedQuizIds } = useGlobalContext()
  const prevUnansweredRef = useRef<number[]>([])
  const { appUserId } = useAppUser()

  const { data: userQuizAnswers = [] } = useQuery({
    queryKey: ['user_quiz_answers', appUserId],
    queryFn: async (): Promise<Tables<'user_quiz_answers'>[]> => {
      if (!appUserId) return []

      const { data, error } = await supabase
        .from('user_quiz_answers')
        .select('*')
        .eq('app_user_id', appUserId)

      if (error) throw new Error(error.message)
      return data as Tables<'user_quiz_answers'>[]
    },
    enabled: !!appUserId,
  })

  const { data: groupQuizzes = [] } = useQuery({
    queryKey: ['quizzes', idolGroupId],
    queryFn: async (): Promise<Tables<'quizzes'>[]> => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('idol_group_id', idolGroupId ?? 0)
      if (error) throw new Error(error.message)
      return data as Tables<'quizzes'>[]
    },
    enabled: !!idolGroupId,
  })

  const answeredQuizIds = useMemo(
    () => userQuizAnswers.map((a) => a.quiz_id),
    [userQuizAnswers],
  )

  const unansweredQuizIds = useMemo(
    () =>
      groupQuizzes
        .filter((quiz) => !answeredQuizIds.includes(quiz.quiz_id))
        .map((quiz) => quiz.quiz_id),
    [groupQuizzes, answeredQuizIds],
  )

  useEffect(() => {
    if (!setSelectedQuizIds) return
    const changed =
      JSON.stringify(prevUnansweredRef.current) !==
      JSON.stringify(unansweredQuizIds)
    if (changed) {
      setSelectedQuizIds(unansweredQuizIds)
      prevUnansweredRef.current = [...unansweredQuizIds]
    }
  }, [unansweredQuizIds, setSelectedQuizIds])
}
