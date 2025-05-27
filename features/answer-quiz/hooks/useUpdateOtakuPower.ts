import { useState } from 'react'
import { UserScoreRepository } from '@/repositories/userScoreRepository'
import { BasicScoreCalculator } from '@/utils/scoring/basicScoreCalculator'
import type { ScoreCalculationResult } from '@/utils/scoring/types'

type UpdateOtakuPowerParams = {
  userId: number
  quizId: number
  groupId: number
  difficultyId: number
  isCorrect: boolean
}

type UpdateOtakuPowerResult = {
  success: boolean
  scoreAdded?: number
  error?: Error
}

export const useUpdateOtakuPower = () => {
  const [isUpdating, setIsUpdating] = useState(false)
  const scoreRepository = new UserScoreRepository()
  const scoreCalculator = new BasicScoreCalculator()

  const updateOtakuPower = async (
    params: UpdateOtakuPowerParams,
  ): Promise<UpdateOtakuPowerResult> => {
    setIsUpdating(true)

    try {
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
        success: true,
        scoreAdded: scoreToAdd,
      }
    } catch (error) {
      console.error('Failed to update otaku power:', error)
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      }
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    updateOtakuPower,
    isUpdating,
  }
}
