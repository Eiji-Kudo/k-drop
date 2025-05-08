import { Tables } from '@/database.types'
import { supabase } from '@/utils/supabase'
import { useQuery } from '@tanstack/react-query'

export type QuizWithChoices = Tables<'quizzes'> & {
  choices: Tables<'quiz_choices'>[]
}

export const useQuizQuery = (quizId: number) => {
  return useQuery({
    queryKey: ['quizzes', quizId],
    queryFn: async () => {
      // First get the quiz
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('quiz_id', quizId)
        .single()

      if (quizError) throw new Error(quizError.message)

      // Then get the choices for this quiz
      const { data: choices, error: choicesError } = await supabase
        .from('quiz_choices')
        .select('*')
        .eq('quiz_id', quizId)
        .order('quiz_choice_id') // Order by ID to ensure consistent order

      if (choicesError) throw new Error(choicesError.message)

      // Return combined data
      return {
        ...quiz,
        choices: choices,
      } as QuizWithChoices
    },
    enabled: !!quizId,
  })
}
