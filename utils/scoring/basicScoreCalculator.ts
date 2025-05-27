import type {
  ScoreCalculator,
  ScoreCalculationParams,
  ScoreCalculationResult,
  DifficultyConfig,
} from './types'

export class BasicScoreCalculator implements ScoreCalculator {
  private difficultyConfig: DifficultyConfig = {
    1: { baseScore: 100, multiplier: 1.0 }, // Easy
    2: { baseScore: 100, multiplier: 1.5 }, // Normal
    3: { baseScore: 100, multiplier: 2.0 }, // Hard
  }

  calculate(params: ScoreCalculationParams): ScoreCalculationResult {
    if (!params.isCorrect) {
      return { scoreToAdd: 0 }
    }

    const config =
      this.difficultyConfig[params.difficultyId] || this.difficultyConfig[1]
    const baseScore = config.baseScore
    const difficultyBonus = Math.floor(baseScore * (config.multiplier - 1))

    const scoreToAdd = baseScore + difficultyBonus

    return {
      scoreToAdd,
      breakdown: {
        baseScore,
        difficultyBonus,
      },
    }
  }
}
