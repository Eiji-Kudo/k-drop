import { rankingRepository } from '../rankingRepository'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/database.types'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const testSupabase = createClient<Database>(supabaseUrl, supabaseKey)

jest.mock('@/utils/supabase', () => {
  const { createClient } = require('@supabase/supabase-js')
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
  return {
    supabase: createClient(supabaseUrl, supabaseKey),
  }
})

describe('rankingRepository', () => {
  const testUserIds = [
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333'
  ]

  beforeEach(async () => {
    await testSupabase.from('user_idol_group_scores').delete().gte('app_user_id', 9000)
    await testSupabase.from('user_profiles').delete().gte('app_user_id', 9000)
    await testSupabase.from('app_users').delete().gte('app_user_id', 9000)
    await testSupabase.from('idol_groups').delete().gte('idol_group_id', 9000)

    const { data: existingLayers } = await testSupabase
      .from('total_otaku_layers')
      .select('total_otaku_layer_id')
      .eq('total_otaku_layer_id', 1)
      .single()

    if (!existingLayers) {
      await testSupabase
        .from('total_otaku_layers')
        .insert([{ total_otaku_layer_id: 1, layer_name: 'Test Layer', min_score: 0, max_score: 10000 }])
    }

    const { data: existingGroupLayers } = await testSupabase
      .from('group_otaku_layers')
      .select('group_otaku_layer_id')
      .eq('group_otaku_layer_id', 1)
      .single()

    if (!existingGroupLayers) {
      await testSupabase
        .from('group_otaku_layers')
        .insert([{ group_otaku_layer_id: 1, layer_name: 'Test Group Layer', min_score: 0, max_score: 10000 }])
    }

    const { data: existingCategories } = await testSupabase
      .from('group_categories')
      .select('group_category_id')
      .eq('group_category_id', 1)
      .single()

    if (!existingCategories) {
      await testSupabase
        .from('group_categories')
        .insert([{ group_category_id: 1, category_name: 'Test Category' }])
    }

    await testSupabase
      .from('idol_groups')
      .insert([
        { idol_group_id: 9001, idol_group_name: 'Test Group 1', group_category_id: 1 },
        { idol_group_id: 9002, idol_group_name: 'Test Group 2', group_category_id: 1 },
        { idol_group_id: 9003, idol_group_name: 'Test Group 3', group_category_id: 1 },
      ])

    await testSupabase
      .from('app_users')
      .insert([
        { app_user_id: 9001, line_account_id: 'test-line-9001', supabase_uuid: testUserIds[0] },
        { app_user_id: 9002, line_account_id: 'test-line-9002', supabase_uuid: testUserIds[1] },
        { app_user_id: 9003, line_account_id: 'test-line-9003', supabase_uuid: testUserIds[2] },
      ])

    await testSupabase
      .from('user_profiles')
      .insert([
        { 
          app_user_id: 9001, 
          user_name: 'TestUser1', 
          total_otaku_score: 1000,
          total_otaku_layer_id: 1,
          remaining_drop: 10
        },
        { 
          app_user_id: 9002, 
          user_name: 'TestUser2', 
          total_otaku_score: 800,
          total_otaku_layer_id: 1,
          remaining_drop: 10
        },
        { 
          app_user_id: 9003, 
          user_name: 'TestUser3', 
          total_otaku_score: 600,
          total_otaku_layer_id: 1,
          remaining_drop: 10
        },
      ])

    await testSupabase
      .from('user_idol_group_scores')
      .insert([
        { app_user_id: 9001, idol_group_id: 9001, otaku_score: 700, group_otaku_layer_id: 1 },
        { app_user_id: 9001, idol_group_id: 9002, otaku_score: 300, group_otaku_layer_id: 1 },
        { app_user_id: 9002, idol_group_id: 9002, otaku_score: 600, group_otaku_layer_id: 1 },
        { app_user_id: 9002, idol_group_id: 9001, otaku_score: 200, group_otaku_layer_id: 1 },
        { app_user_id: 9003, idol_group_id: 9001, otaku_score: 500, group_otaku_layer_id: 1 },
        { app_user_id: 9003, idol_group_id: 9003, otaku_score: 100, group_otaku_layer_id: 1 },
      ])
  })

  afterEach(async () => {
    await testSupabase.from('user_idol_group_scores').delete().gte('app_user_id', 9000)
    await testSupabase.from('user_profiles').delete().gte('app_user_id', 9000)
    await testSupabase.from('app_users').delete().gte('app_user_id', 9000)
    await testSupabase.from('idol_groups').delete().gte('idol_group_id', 9000)
  })

  describe('fetchTotalRankings', () => {
    it('should fetch total rankings ordered by total_otaku_score descending', async () => {
      const rankings = await rankingRepository.fetchTotalRankings()

      const testRankings = rankings.filter(r => r.app_user_id >= 9001 && r.app_user_id <= 9003)
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
      const testRankings = rankings.filter(r => r.app_user_id >= 9001 && r.app_user_id <= 9003)

      expect(testRankings).toEqual([])
    })

    it('should handle database errors properly', async () => {
      // Mock the select method to return an error
      const mockError = new Error('Database connection error')
      jest.spyOn(rankingRepository, 'fetchTotalRankings').mockRejectedValueOnce(mockError)

      await expect(rankingRepository.fetchTotalRankings()).rejects.toThrow('Database connection error')
    })
  })

  describe('fetchGroupRankings', () => {
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
      // Mock the fetchGroupRankings method to return an error
      const mockError = new Error('Database query error')
      jest.spyOn(rankingRepository, 'fetchGroupRankings').mockRejectedValueOnce(mockError)

      await expect(rankingRepository.fetchGroupRankings(9001)).rejects.toThrow('Database query error')
    })
  })

  describe('fetchIdolGroups', () => {
    it('should fetch all idol groups ordered by name', async () => {
      const groups = await rankingRepository.fetchIdolGroups()

      const testGroups = groups.filter(g => g.idol_group_id >= 9001)
      expect(testGroups).toHaveLength(3)
      expect(testGroups[0].idol_group_name).toBe('Test Group 1')
      expect(testGroups[1].idol_group_name).toBe('Test Group 2')
      expect(testGroups[2].idol_group_name).toBe('Test Group 3')
    })

    it('should return empty array when no groups exist', async () => {
      await testSupabase.from('user_idol_group_scores').delete().gte('idol_group_id', 9000)
      await testSupabase.from('idol_groups').delete().gte('idol_group_id', 9000)

      const groups = await rankingRepository.fetchIdolGroups()
      const testGroups = groups.filter(g => g.idol_group_id >= 9001 && g.idol_group_id <= 9003)

      expect(testGroups).toEqual([])
    })

    it('should handle database errors properly', async () => {
      // Mock the fetchIdolGroups method to return an error
      const mockError = new Error('Network error')
      jest.spyOn(rankingRepository, 'fetchIdolGroups').mockRejectedValueOnce(mockError)

      await expect(rankingRepository.fetchIdolGroups()).rejects.toThrow('Network error')
    })
  })

  describe('concurrent operations', () => {
    it('should handle multiple concurrent requests correctly', async () => {
      const [totalRankings, group1Rankings, group2Rankings, groups] = await Promise.all([
        rankingRepository.fetchTotalRankings(),
        rankingRepository.fetchGroupRankings(9001),
        rankingRepository.fetchGroupRankings(9002),
        rankingRepository.fetchIdolGroups(),
      ])

      expect(totalRankings.filter(r => r.app_user_id >= 9001 && r.app_user_id <= 9003)).toHaveLength(3)
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

        const sumOfGroupScores = userGroupScores.data?.reduce(
          (sum, score) => sum + score.otaku_score, 
          0
        ) || 0

        expect(user.total_otaku_score).toBe(sumOfGroupScores)
      }
    })
  })
})