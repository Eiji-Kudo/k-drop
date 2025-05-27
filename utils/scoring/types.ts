export type ScoreCalculationParams = {
  isCorrect: boolean
  difficultyId: number
  groupId: number
  userId: number
  streak?: number
  timeSpent?: number
  eventMultiplier?: number
}

export type ScoreCalculationResult = {
  scoreToAdd: number
  breakdown?: {
    baseScore: number
    difficultyBonus: number
    streakBonus?: number
    timeBonus?: number
    eventBonus?: number
  }
}

export type ScoreCalculator = {
  calculate(params: ScoreCalculationParams): ScoreCalculationResult
}

export type DifficultyConfig = {
  [difficultyId: number]: {
    baseScore: number
    multiplier: number
  }
}
