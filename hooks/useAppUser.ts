import { supabase } from '@/utils/supabase'
import { useQuery } from '@tanstack/react-query'

/**
 * Hook to get the app_user_id corresponding to the authenticated user
 * This provides a centralized way to access the app_user_id across the app
 */
export function useAppUser() {
  // Get the auth user from Supabase
  const authUserQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser()
      return data.user
    },
  })

  // Get the app_user_id using the auth user's ID
  const appUserQuery = useQuery({
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
