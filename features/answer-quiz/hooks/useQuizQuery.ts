import { Tables } from '@/database.types'
import { supabase } from '@/utils/supabase'
import { useQuery } from '@tanstack/react-query'

export const useQuizQuery = (quizId: string) => {
  return useQuery({
    queryKey: ['quizzes', quizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('quiz_id', quizId)
        .single()
      if (error) throw new Error(error.message)
      return data as Tables<'quizzes'>
    },
    enabled: !!quizId,
  })
}
