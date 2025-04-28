import { useGlobalContext } from '@/context/GlobalContext'
import { Tables } from '@/database.types'
import { supabase } from '@/utils/supabase'
import { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

export function useSyncUnansweredQuizIds(idolGroupId: number | null) {
  const { selectedQuizIds, setSelectedQuizIds } = useGlobalContext()

  const { data: currentUser } = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      const { data } = await supabase.auth.getUser()
      return data.user
    },
  })

  const { data: userQuizAnswers } = useQuery({
    queryKey: ['user_quiz_answers', currentUser?.id],
    queryFn: async (): Promise<Tables<'user_quiz_answers'>[]> => {
      if (!currentUser) return []

      const { data, error } = await supabase
        .from('user_quiz_answers')
        .select('*')
        .eq('user_id', currentUser.id)
      if (error) throw new Error(error.message)
      return data as Tables<'user_quiz_answers'>[]
    },
    enabled: !!currentUser,
  })

  const { data: groupQuizzes } = useQuery({
    queryKey: ['quizzes', idolGroupId],
    queryFn: async (): Promise<Tables<'quizzes'>[]> => {
      if (!idolGroupId) return []

      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('idol_group_id', idolGroupId)
      if (error) throw new Error(error.message)
      return data as Tables<'quizzes'>[]
    },
    enabled: !!idolGroupId,
  })

  const answeredQuizIds = useMemo(
    () => userQuizAnswers?.map((a) => a.quiz_id) ?? [],
    [userQuizAnswers],
  )

  const unansweredQuizIds = useMemo(
    () =>
      groupQuizzes
        ?.filter((quiz) => !answeredQuizIds.includes(quiz.quiz_id))
        .map((quiz) => quiz.quiz_id) ?? [],
    [groupQuizzes, answeredQuizIds],
  )

  useEffect(() => {
    if (!setSelectedQuizIds) return

    const isSameLength = unansweredQuizIds.length === selectedQuizIds.length
    const isSame =
      isSameLength &&
      unansweredQuizIds.every((id, i) => id === selectedQuizIds[i])

    if (!isSame) {
      setSelectedQuizIds(unansweredQuizIds)
    }
  }, [unansweredQuizIds, selectedQuizIds, setSelectedQuizIds, idolGroupId])
}
