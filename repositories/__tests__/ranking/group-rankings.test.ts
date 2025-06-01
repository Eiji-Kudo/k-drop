import { rankingRepository } from '@/repositories/rankingRepository'
import {
  setupTestData,
  cleanupTestData,
  setupSupabaseMock,
} from '@/repositories/__tests__/ranking/setup'

setupSupabaseMock()

describe('rankingRepository.fetchGroupRankings', () => {
  beforeEach(async () => {
    await setupTestData()
  })

  afterEach(async () => {
    await cleanupTestData()
  })

  it('should fetch group rankings for specified group ordered by otaku_score descending', async () => {
    const rankings = await rankingRepository.fetchGroupRankings(9001)

    expect(rankings).toHaveLength(3)
    expect(rankings[0].app_user_id).toBe(9001)
    expect(rankings[0].otaku_score).toBe(700)
    expect(rankings[1].app_user_id).toBe(9003)
    expect(rankings[1].otaku_score).toBe(500)
    expect(rankings[2].app_user_id).toBe(9002)
    expect(rankings[2].otaku_score).toBe(200)
  })

  it('should include related data (idol_groups, group_otaku_layers, user_profiles)', async () => {
    const rankings = await rankingRepository.fetchGroupRankings(9001)

    expect(rankings[0]).toHaveProperty('idol_groups')
    expect(rankings[0]).toHaveProperty('group_otaku_layers')
    expect(rankings[0]).toHaveProperty('app_users')
    expect(rankings[0].app_users).toHaveProperty('user_profiles')
    expect(rankings[0].idol_groups?.idol_group_name).toBe('Test Group 1')
  })

  it('should return empty array when groupId is not provided', async () => {
    const rankings = await rankingRepository.fetchGroupRankings()

    expect(rankings).toEqual([])
  })

  it('should return empty array when no data exists for the group', async () => {
    const rankings = await rankingRepository.fetchGroupRankings(999)

    expect(rankings).toEqual([])
  })

  it('should handle database errors properly', async () => {
    const mockError = new Error('Database query error')
    jest
      .spyOn(rankingRepository, 'fetchGroupRankings')
      .mockRejectedValueOnce(mockError)

    await expect(rankingRepository.fetchGroupRankings(9001)).rejects.toThrow(
      'Database query error',
    )
  })
})
