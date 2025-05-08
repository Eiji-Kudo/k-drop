import { Tables } from '@/database.types'
import { supabase } from '@/utils/supabase'
import { useQuery } from '@tanstack/react-query'





export const useQuiz = (quizId: number) => {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('quiz_id', quizId)
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!quizId,
  })
}


export const useQuizChoices = (quizId: number) => {
  return useQuery({
    queryKey: ['quizChoices', quizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_choices')
        .select('*')
        .eq('quiz_id', quizId)
        .order('quiz_choice_id') // Order by ID to ensure consistent order

      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!quizId,
  })
}
