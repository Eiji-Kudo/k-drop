import { Tables } from '@/database.types'
import { supabase } from '@/utils/supabase'

export type UserProfileWithLayer = Tables<'user_profiles'> & {
  total_otaku_layers: Tables<'total_otaku_layers'>
}

export type UserGroupScoreWithDetails = Tables<'user_idol_group_scores'> & {
  idol_groups: Tables<'idol_groups'>
  group_otaku_layers: Tables<'group_otaku_layers'>
  app_users: {
    user_profiles: Tables<'user_profiles'>[]
  }
}

export const rankingRepository = {
  fetchTotalRankings: async (): Promise<UserProfileWithLayer[]> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*, total_otaku_layers(*)')
      .order('total_otaku_score', { ascending: false })

    if (error) {
      console.error('Error fetching total rankings:', error)
      throw error
    }

    return data
  },

  fetchGroupRankings: async (
    groupId?: number,
  ): Promise<UserGroupScoreWithDetails[]> => {
    if (!groupId) {
      return []
    }

    const query = supabase
      .from('user_idol_group_scores')
      .select(
        '*, idol_groups(*), group_otaku_layers(*), app_users(user_profiles(*))',
      )
      .eq('idol_group_id', groupId)
      .order('otaku_score', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching group rankings:', error)
      throw error
    }

    return data
  },

  fetchIdolGroups: async (): Promise<Tables<'idol_groups'>[]> => {
    const { data, error } = await supabase
      .from('idol_groups')
      .select('*')
      .order('idol_group_name')

    if (error) {
      console.error('Error fetching idol groups:', error)
      throw error
    }

    return data
  },
}
