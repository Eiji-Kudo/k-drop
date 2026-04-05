/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable max-lines */
import { supabase } from '@/utils/supabase'
import {
  mockUserProfiles,
  mockUserIdolGroupScores,
  mockIdolGroups,
} from './mockData'

export const setupTestData = () => {
  // Configure the global mock to return test data
  const mockSupabase = supabase as jest.Mocked<typeof supabase>

  const userProfiles = mockUserProfiles
  const userIdolGroupScores = mockUserIdolGroupScores
  const idolGroups = mockIdolGroups

  // Configure mock responses
  mockSupabase.from.mockImplementation((table: string) => {
    const mockQuery: any = {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
    }

    // Handle different tables
    if (table === 'user_profiles') {
      let sortedData = userProfiles
      mockQuery.order = jest
        .fn()
        .mockImplementation(
          (column: string, options?: { ascending?: boolean }) => {
            if (
              column === 'total_otaku_score' &&
              options?.ascending === false
            ) {
              sortedData = [...userProfiles].sort(
                (a, b) => b.total_otaku_score - a.total_otaku_score,
              )
            }
            return mockQuery
          },
        )
      mockQuery.then = jest
        .fn()
        .mockImplementation((callback) =>
          callback({ data: sortedData, error: null }),
        )
    } else if (table === 'user_idol_group_scores') {
      let filteredData = userIdolGroupScores
      mockQuery.select = jest.fn().mockImplementation((columns: string) => {
        // If only selecting otaku_score, map the data
        if (columns === 'otaku_score') {
          mockQuery.then = jest.fn().mockImplementation((callback) => {
            const scoreOnlyData = filteredData.map((d) => ({
              otaku_score: d.otaku_score,
            }))
            callback({ data: scoreOnlyData, error: null })
          })
        }
        return mockQuery
      })
      mockQuery.eq = jest
        .fn()
        .mockImplementation((column: string, value: any) => {
          if (column === 'idol_group_id') {
            filteredData = userIdolGroupScores.filter(
              (s) => s.idol_group_id === value,
            )
          } else if (column === 'app_user_id') {
            filteredData = userIdolGroupScores.filter(
              (s) => s.app_user_id === value,
            )
          }
          return mockQuery
        })
      mockQuery.order = jest
        .fn()
        .mockImplementation(
          (column: string, options?: { ascending?: boolean }) => {
            if (column === 'otaku_score' && options?.ascending === false) {
              filteredData = [...filteredData].sort(
                (a, b) => b.otaku_score - a.otaku_score,
              )
            }
            return mockQuery
          },
        )
      mockQuery.then =
        mockQuery.then ||
        jest
          .fn()
          .mockImplementation((callback) =>
            callback({ data: filteredData, error: null }),
          )
    } else if (table === 'idol_groups') {
      let sortedGroups = idolGroups
      mockQuery.order = jest.fn().mockImplementation((column: string) => {
        if (column === 'idol_group_name') {
          sortedGroups = [...idolGroups].sort((a, b) =>
            a.idol_group_name.localeCompare(b.idol_group_name),
          )
        }
        return mockQuery
      })
      mockQuery.then = jest
        .fn()
        .mockImplementation((callback) =>
          callback({ data: sortedGroups, error: null }),
        )
    } else {
      mockQuery.then = jest
        .fn()
        .mockImplementation((callback) => callback({ data: [], error: null }))
    }

    return mockQuery
  })

  return { userProfiles, userIdolGroupScores, idolGroups }
}

export const cleanupTestData = () => {
  // Mock implementation for test data cleanup
  jest.clearAllMocks()
}
