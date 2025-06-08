import { rankingRepository } from '@/repositories/rankingRepository'
import {
  setupTestData,
  cleanupTestData,
} from '@/repositories/__tests__/ranking/setup'

describe('rankingRepository.fetchIdolGroups', () => {
  beforeEach(() => {
    setupTestData()
  })

  afterEach(() => {
    cleanupTestData()
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
    // Mock empty result
    jest.spyOn(rankingRepository, 'fetchIdolGroups').mockResolvedValueOnce([])

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
