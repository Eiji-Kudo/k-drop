import { useGlobalContext } from '@/context/GlobalContext'
import { Tables } from '@/database.types'
import { supabase } from '@/utils/supabase'
import { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

export function useSyncUnansweredQuizIds(groupId: number | null) {
  const { selectedQuizQuestions, setSelectedQuizQuestions } = useGlobalContext()

  const { data: currentUser } = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      const { data } = await supabase.auth.getUser()
      return data.user
    },
  })

  const { data: userQuizAnswers } = useQuery({
    queryKey: ['user_quiz_answer', currentUser?.id],
    queryFn: async (): Promise<Tables<'user_quiz_answer'>[]> => {
      if (!currentUser) return []
      const { data, error } = await supabase
        .from('user_quiz_answer')
        .select('*')
        .eq('user_id', currentUser.id)
      if (error) throw new Error(error.message)
      return data as Tables<'user_quiz_answer'>[]
    },
    enabled: !!currentUser,
  })

  const { data: groupQuizzes } = useQuery({
    queryKey: ['quiz', currentUser?.id, groupId],
    queryFn: async (): Promise<Tables<'quiz'>[]> => {
      if (!currentUser) return []
      const { data, error } = await supabase.from('quiz').select('*').eq('idol_group_id', groupId)
      if (error) throw new Error(error.message)
      return data as Tables<'quiz'>[]
    },
    enabled: !!currentUser && !!groupId,
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
    if (!setSelectedQuizQuestions) return

    const isSameLength = unansweredQuizIds.length === selectedQuizQuestions.length
    const isSame =
      isSameLength && unansweredQuizIds.every((id, i) => id === selectedQuizQuestions[i])

    if (!isSame) {
      setSelectedQuizQuestions(unansweredQuizIds)
    }
  }, [unansweredQuizIds, selectedQuizQuestions, setSelectedQuizQuestions, groupId])
}
