import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { useAppUser } from '@/hooks/useAppUser'

type ProfileData = {
  userName: string
  nickname?: string
  avatarUrl?: string
  description?: string
  fanSince?: Date
  totalOtakuScore: number
  totalOtakuLayerId?: number
  totalOtakuLayerName?: string
}

export function useProfileData() {
  const { appUserId } = useAppUser()

  return useQuery({
    queryKey: ['profile', appUserId],
    queryFn: async () => {
      if (!appUserId) throw new Error('No user ID')

      const { data, error } = await supabase
        .from('user_profiles')
        .select(
          `
          user_name,
          nickname,
          avatar_url,
          description,
          fan_since,
          total_otaku_score,
          total_otaku_layer_id,
          total_otaku_layers (
            layer_name
          )
        `,
        )
        .eq('app_user_id', appUserId)
        .single()

      if (error) throw error
      if (!data) throw new Error('Profile not found')

      const profileData: ProfileData = {
        userName: data.user_name,
        nickname: data.nickname || undefined,
        avatarUrl: data.avatar_url || undefined,
        description: data.description || undefined,
        fanSince: data.fan_since ? new Date(data.fan_since) : undefined,
        totalOtakuScore: data.total_otaku_score || 0,
        totalOtakuLayerId: data.total_otaku_layer_id,
        totalOtakuLayerName:
          data.total_otaku_layers &&
          typeof data.total_otaku_layers === 'object' &&
          'layer_name' in data.total_otaku_layers
            ? data.total_otaku_layers.layer_name
            : undefined,
      }

      return profileData
    },
    enabled: !!appUserId,
  })
}
