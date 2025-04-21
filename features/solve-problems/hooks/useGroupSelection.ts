import { Tables } from '@/database.types'
import { supabase } from '@/utils/supabase'
import { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

export function useSetQuizQuestionsFromSelectedGroup(
  selectedQuizQuestions: number[] = [],
  setSelectedQuizQuestions?: (quizIds: number[]) => void,
) {
  // ユーザー情報を取得
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

  // アイドルグループを取得
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

  // 未解答のクイズだけを選択状態に保つ
  useEffect(() => {
    if (!setSelectedQuizQuestions) return

    const unsolvedQuizzes = selectedQuizQuestions.filter((id: number) => !solvedQuizIds.includes(id))

    const isSelectionUnchanged =
      unsolvedQuizzes.length === selectedQuizQuestions.length &&
      unsolvedQuizzes.every((v: number, i: number) => v === selectedQuizQuestions[i])

    if (!isSelectionUnchanged) {
      setSelectedQuizQuestions(unsolvedQuizzes)
    }
  }, [solvedQuizIds, selectedQuizQuestions, setSelectedQuizQuestions])

  return {
    groups,
    solvedQuizIds,
  }
}
