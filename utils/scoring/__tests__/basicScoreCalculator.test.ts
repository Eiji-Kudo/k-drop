import { BasicScoreCalculator } from '../basicScoreCalculator'
import type { ScoreCalculationParams } from '../types'

describe('BasicScoreCalculator', () => {
  let calculator: BasicScoreCalculator

  beforeEach(() => {
    calculator = new BasicScoreCalculator()
  })

  describe('calculate', () => {
    it('should return 0 score for incorrect answer', () => {
      const params: ScoreCalculationParams = {
        isCorrect: false,
        difficultyId: 1,
        groupId: 1,
        userId: 1,
      }

      const result = calculator.calculate(params)
      expect(result.scoreToAdd).toBe(0)
      expect(result.breakdown).toBeUndefined()
    })

    it('should calculate score for easy difficulty (id: 1)', () => {
      const params: ScoreCalculationParams = {
        isCorrect: true,
        difficultyId: 1,
        groupId: 1,
        userId: 1,
      }

      const result = calculator.calculate(params)
      expect(result.scoreToAdd).toBe(100)
      expect(result.breakdown).toEqual({
        baseScore: 100,
        difficultyBonus: 0,
      })
    })

    it('should calculate score for normal difficulty (id: 2)', () => {
      const params: ScoreCalculationParams = {
        isCorrect: true,
        difficultyId: 2,
        groupId: 1,
        userId: 1,
      }

      const result = calculator.calculate(params)
      expect(result.scoreToAdd).toBe(150)
      expect(result.breakdown).toEqual({
        baseScore: 100,
        difficultyBonus: 50,
      })
    })

    it('should calculate score for hard difficulty (id: 3)', () => {
      const params: ScoreCalculationParams = {
        isCorrect: true,
        difficultyId: 3,
        groupId: 1,
        userId: 1,
      }

      const result = calculator.calculate(params)
      expect(result.scoreToAdd).toBe(200)
      expect(result.breakdown).toEqual({
        baseScore: 100,
        difficultyBonus: 100,
      })
    })

    it('should use easy difficulty as default for unknown difficulty id', () => {
      const params: ScoreCalculationParams = {
        isCorrect: true,
        difficultyId: 999,
        groupId: 1,
        userId: 1,
      }

      const result = calculator.calculate(params)
      expect(result.scoreToAdd).toBe(100)
      expect(result.breakdown).toEqual({
        baseScore: 100,
        difficultyBonus: 0,
      })
    })
  })
})
