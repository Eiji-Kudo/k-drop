import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { useAppUser } from '@/hooks/useAppUser'

type UserGroup = {
  groupId: number
  groupName: string
  thumbnailImage?: string
  otakuScore: number
  layerId?: number
}

export function useUserGroups() {
  const { appUserId } = useAppUser()

  return useQuery({
    queryKey: ['userGroups', appUserId],
    queryFn: async () => {
      if (!appUserId) throw new Error('No user ID')

      const { data, error } = await supabase
        .from('user_idol_group_scores')
        .select(
          `
          idol_group_id,
          otaku_score,
          group_otaku_layer_id,
          idol_groups (
            idol_group_name,
            thumbnail_image
          )
        `,
        )
        .eq('app_user_id', appUserId)
        .order('otaku_score', { ascending: false })

      if (error) throw error

      const groups: UserGroup[] = (data || []).map((item) => ({
        groupId: item.idol_group_id,
        groupName:
          item.idol_groups &&
          typeof item.idol_groups === 'object' &&
          'idol_group_name' in item.idol_groups
            ? item.idol_groups.idol_group_name
            : 'Unknown',
        thumbnailImage:
          item.idol_groups &&
          typeof item.idol_groups === 'object' &&
          'thumbnail_image' in item.idol_groups
            ? item.idol_groups.thumbnail_image || undefined
            : undefined,
        otakuScore: item.otaku_score || 0,
        layerId: item.group_otaku_layer_id,
      }))

      return groups
    },
    enabled: !!appUserId,
  })
}
