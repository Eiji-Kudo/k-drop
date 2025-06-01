import { rankingRepository } from '@/repositories/rankingRepository'
import {
  testSupabase,
  setupTestData,
  cleanupTestData,
  setupSupabaseMock,
} from '@/repositories/__tests__/ranking/setup'

setupSupabaseMock()

describe('rankingRepository.fetchIdolGroups', () => {
  beforeEach(async () => {
    await setupTestData()
  })

  afterEach(async () => {
    await cleanupTestData()
  })

  it('should fetch all idol groups ordered by name', async () => {
    const groups = await rankingRepository.fetchIdolGroups()

    const testGroups = groups.filter((g) => g.idol_group_id >= 9001)
    expect(testGroups).toHaveLength(3)
    expect(testGroups[0].idol_group_name).toBe('Test Group 1')
    expect(testGroups[1].idol_group_name).toBe('Test Group 2')
    expect(testGroups[2].idol_group_name).toBe('Test Group 3')
  })

  it('should return empty array when no groups exist', async () => {
    await testSupabase
      .from('user_idol_group_scores')
      .delete()
      .gte('idol_group_id', 9000)
    await testSupabase.from('idol_groups').delete().gte('idol_group_id', 9000)

    const groups = await rankingRepository.fetchIdolGroups()
    const testGroups = groups.filter(
      (g) => g.idol_group_id >= 9001 && g.idol_group_id <= 9003,
    )

    expect(testGroups).toEqual([])
  })

  it('should handle database errors properly', async () => {
    const mockError = new Error('Network error')
    jest
      .spyOn(rankingRepository, 'fetchIdolGroups')
      .mockRejectedValueOnce(mockError)

    await expect(rankingRepository.fetchIdolGroups()).rejects.toThrow(
      'Network error',
    )
  })
})
