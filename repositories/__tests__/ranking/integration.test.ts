import { rankingRepository } from '@/repositories/rankingRepository'
import {
  testSupabase,
  setupTestData,
  cleanupTestData,
  setupSupabaseMock,
} from '@/repositories/__tests__/ranking/setup'

setupSupabaseMock()

describe('rankingRepository integration tests', () => {
  beforeEach(async () => {
    await setupTestData()
  })

  afterEach(async () => {
    await cleanupTestData()
  })

  describe('concurrent operations', () => {
    it('should handle multiple concurrent requests correctly', async () => {
      const [totalRankings, group1Rankings, group2Rankings, groups] =
        await Promise.all([
          rankingRepository.fetchTotalRankings(),
          rankingRepository.fetchGroupRankings(9001),
          rankingRepository.fetchGroupRankings(9002),
          rankingRepository.fetchIdolGroups(),
        ])

      expect(
        totalRankings.filter(
          (r) => r.app_user_id >= 9001 && r.app_user_id <= 9003,
        ),
      ).toHaveLength(3)
      expect(group1Rankings).toHaveLength(3)
      expect(group2Rankings).toHaveLength(2)
      expect(groups.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('data integrity', () => {
    it('should maintain consistency between total score and individual group scores', async () => {
      const totalRankings = await rankingRepository.fetchTotalRankings()

      for (const user of totalRankings) {
        const userGroupScores = await testSupabase
          .from('user_idol_group_scores')
          .select('otaku_score')
          .eq('app_user_id', user.app_user_id)

        const sumOfGroupScores =
          userGroupScores.data?.reduce(
            (sum, score) => sum + score.otaku_score,
            0,
          ) || 0

        expect(user.total_otaku_score).toBe(sumOfGroupScores)
      }
    })
  })
})
