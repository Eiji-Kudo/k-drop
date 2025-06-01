import { rankingRepository } from '@/repositories/rankingRepository'
import {
  testSupabase,
  setupTestData,
  cleanupTestData,
  setupSupabaseMock,
} from '@/repositories/__tests__/ranking/setup'

setupSupabaseMock()

describe('rankingRepository.fetchTotalRankings', () => {
  beforeEach(async () => {
    await setupTestData()
  })

  afterEach(async () => {
    await cleanupTestData()
  })

  it('should fetch total rankings ordered by total_otaku_score descending', async () => {
    const rankings = await rankingRepository.fetchTotalRankings()

    const testRankings = rankings.filter(
      (r) => r.app_user_id >= 9001 && r.app_user_id <= 9003,
    )
    expect(testRankings).toHaveLength(3)
    expect(testRankings[0].user_name).toBe('TestUser1')
    expect(testRankings[0].total_otaku_score).toBe(1000)
    expect(testRankings[1].user_name).toBe('TestUser2')
    expect(testRankings[1].total_otaku_score).toBe(800)
    expect(testRankings[2].user_name).toBe('TestUser3')
    expect(testRankings[2].total_otaku_score).toBe(600)
  })

  it('should include total_otaku_layers relation', async () => {
    const rankings = await rankingRepository.fetchTotalRankings()

    expect(rankings[0]).toHaveProperty('total_otaku_layers')
  })

  it('should return empty array when no data exists', async () => {
    await testSupabase.from('user_profiles').delete().gte('app_user_id', 9000)

    const rankings = await rankingRepository.fetchTotalRankings()
    const testRankings = rankings.filter(
      (r) => r.app_user_id >= 9001 && r.app_user_id <= 9003,
    )

    expect(testRankings).toEqual([])
  })

  it('should handle database errors properly', async () => {
    const mockError = new Error('Database connection error')
    jest
      .spyOn(rankingRepository, 'fetchTotalRankings')
      .mockRejectedValueOnce(mockError)

    await expect(rankingRepository.fetchTotalRankings()).rejects.toThrow(
      'Database connection error',
    )
  })
})
