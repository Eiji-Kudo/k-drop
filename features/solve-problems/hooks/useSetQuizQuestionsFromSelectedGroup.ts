import { Tables } from '@/database.types'
import { supabase } from '@/utils/supabase'
import { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

export function useSetQuizQuestionsFromSelectedGroup(
  selectedQuizQuestions: number[] = [],
  selectedIdolGroupId: number | null,
  setSelectedQuizQuestions?: (quizIds: number[]) => void,
) {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      const { data } = await supabase.auth.getUser()
      return data.user
    },
  })

  // ユーザーのクイズ回答を取得
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

  const { data: quizzes } = useQuery({
    queryKey: ['quiz', user?.id, selectedIdolGroupId],
    queryFn: async (): Promise<Tables<'quiz'>[]> => {
      if (!user) return []
      const { data, error } = await supabase
        .from('quiz')
        .select('*')
        .eq('idol_group_id', selectedIdolGroupId)
      if (error) throw new Error(error.message)
      return data as Tables<'quiz'>[]
    },
    enabled: !!user && !!selectedIdolGroupId,
  })

  const solvedQuizIds = useMemo(() => userQuizAnswer?.map((a) => a.quiz_id) ?? [], [userQuizAnswer])

  const unsolvedQuizIds = useMemo(
    () =>
      quizzes
        ?.filter((quiz) => !solvedQuizIds.includes(quiz.quiz_id))
        .map((quiz) => quiz.quiz_id) ?? [],
    [quizzes, solvedQuizIds],
  )

  // 未解答のクイズだけを選択状態に保つ
  useEffect(() => {
    console.log('unsolvedQuizIds', unsolvedQuizIds)
    if (!setSelectedQuizQuestions) return

    const isSameLength = unsolvedQuizIds.length === selectedQuizQuestions.length
    const isSame = isSameLength && unsolvedQuizIds.every((id, i) => id === selectedQuizQuestions[i])

    if (!isSame) {
      console.log('unsolvedQuizIds', unsolvedQuizIds)
      setSelectedQuizQuestions(unsolvedQuizIds)
    }
  }, [unsolvedQuizIds, selectedQuizQuestions, setSelectedQuizQuestions, selectedIdolGroupId])
}
