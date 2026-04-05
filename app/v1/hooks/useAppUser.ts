import { supabase } from '@/utils/supabase'
import { useQuery } from '@tanstack/react-query'
import { User } from '@supabase/supabase-js'

export function useAppUser() {
  const authUserQuery = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser()
      return data.user
    },
  })

  const appUserQuery = useQuery<number | null>({
    queryKey: ['appUser', authUserQuery.data?.id],
    queryFn: async () => {
      if (!authUserQuery.data?.id) {
        return null
      }

      const { data, error } = await supabase
        .from('app_users')
        .select('app_user_id')
        .eq('supabase_uuid', authUserQuery.data.id)
        .maybeSingle()

      if (error) {
        throw error
      }

      if (!data?.app_user_id) {
        throw new Error('No app_user_id found for the current user')
      }

      return data.app_user_id
    },
    enabled: !!authUserQuery.data?.id,
  })

  return {
    appUserId: appUserQuery.data,
    loading: authUserQuery.isLoading || appUserQuery.isLoading,
    error: authUserQuery.error || appUserQuery.error,
    authUser: authUserQuery.data,
  }
}
