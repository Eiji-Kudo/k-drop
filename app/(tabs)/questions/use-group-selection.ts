import { Tables } from '@/database.types'
import { supabase } from '@/utils/supabase'
import { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export function useGroupSelectionData(selectedGroup: number | null) {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      const { data } = await supabase.auth.getUser()
      return data.user
    },
  })

  const { data: userQuizAnswer } = useQuery({
    queryKey: ['user_quiz_answer', user?.id],
    queryFn: async (): Promise<Tables<'user_quiz_answer'>[]> => {
      if (!user) return []
      const { data, error } = await supabase
        .from('user_quiz_answer')
        .select('*')
        .eq('user_id', user.id)
      if (error) throw new Error(error.message)
      return data as Tables<'user_quiz_answer'>[]
    },
    enabled: !!user,
  })

  const { data: quizQuestions } = useQuery({
    queryKey: ['quiz_question', selectedGroup],
    queryFn: async (): Promise<Tables<'quiz_question'>[]> => {
      if (!selectedGroup) return []
      const { data, error } = await supabase
        .from('quiz_question')
        .select('*')
        .eq('idol_group_id', selectedGroup)
      if (error) throw new Error(error.message)
      return data as Tables<'quiz_question'>[]
    },
    enabled: !!selectedGroup,
  })

  const { data: groups } = useQuery({
    queryKey: ['idol_groups'],
    queryFn: async (): Promise<Tables<'idol_group'>[]> => {
      const { data, error } = await supabase.from('idol_group').select('*')
      if (error) throw new Error(error.message)
      return data as Tables<'idol_group'>[]
    },
  })

  const solvedQuizIds = useMemo(
    () => userQuizAnswer?.map((a) => a.quiz_question_id) ?? [],
    [userQuizAnswer],
  )

  const selectedGroupQuizQuestions = useMemo(
    () =>
      quizQuestions?.map((q) => q.quiz_question_id).filter((id) => !solvedQuizIds.includes(id)) ??
      [],
    [quizQuestions, solvedQuizIds],
  )

  return {
    user,
    userQuizAnswer,
    quizQuestions,
    groups,
    solvedQuizIds,
    selectedGroupQuizQuestions,
  }
}
