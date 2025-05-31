import type { ScoreCalculationResult } from '@/features/answer-quiz/types'
import { BasicScoreCalculator } from '@/features/answer-quiz/utils/scoring/basicScoreCalculator'
import { UserScoreRepository } from '@/repositories/userScoreRepository'
import { supabase } from '@/utils/supabase'
import { useMutation } from '@tanstack/react-query'

type UpdateOtakuPowerParams = {
  userId: number
  quizId: number
  groupId: number
  difficultyId: number
  isCorrect: boolean
  choiceIndex?: number
}

export const useUpdateOtakuPower = () => {
  const scoreRepository = new UserScoreRepository()
  const scoreCalculator = new BasicScoreCalculator()

  const mutation = useMutation({
    mutationFn: async (params: UpdateOtakuPowerParams) => {
      // 1. Record quiz answer
      if (params.choiceIndex !== undefined) {
        await supabase.from('user_quiz_answers').insert({
          app_user_id: params.userId,
          quiz_id: params.quizId,
          selected_choice: params.choiceIndex + 1,
          is_correct: params.isCorrect,
          answered_at: new Date().toISOString(),
        })
      }

      // 2. Calculate and update otaku power
      const calculationResult: ScoreCalculationResult =
        scoreCalculator.calculate({
          isCorrect: params.isCorrect,
          difficultyId: params.difficultyId,
          groupId: params.groupId,
          userId: params.userId,
        })

      const scoreToAdd = calculationResult.scoreToAdd

      if (scoreToAdd > 0) {
        await Promise.all([
          scoreRepository.updateTotalScore(params.userId, scoreToAdd),
          scoreRepository.updateGroupScore(
            params.userId,
            params.groupId,
            scoreToAdd,
          ),
        ])
      }

      return {
        scoreAdded: scoreToAdd,
        breakdown: calculationResult.breakdown,
      }
    },
    onError: (error) => {
      console.error('Failed to update otaku power:', error)
    },
  })

  return mutation
}
