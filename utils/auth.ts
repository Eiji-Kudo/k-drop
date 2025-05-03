import { supabase } from '@/utils/supabase'
import { User } from '@supabase/supabase-js'
import { Session } from '@supabase/supabase-js'

export async function signUpNewUser(): Promise<{
  session: Session | null
  user: User | null
}> {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession()

  if (sessionError) {
    throw sessionError
  }

  if (sessionData?.session) {
    const user = sessionData.session.user
    await ensureUserRecords(user)

    return {
      session: sessionData.session,
      user,
    }
  }

  const { data, error } = await supabase.auth.signInAnonymously()

  if (error) {
    throw error
  }

  if (data.user) {
    await ensureUserRecords(data.user)
  }

  // Cast to the correct return type
  return {
    session: data.session,
    user: data.user,
  }
}

async function ensureUserRecords(user: User): Promise<number | null> {
  if (!user?.id) return null

  try {
    const { data: existingUser } = await supabase
      .from('app_users')
      .select('app_user_id')
      .eq('supabase_uuid', user.id)
      .maybeSingle()

    if (existingUser?.app_user_id) {
      return existingUser.app_user_id as number
    }

    const { data: newUser, error: userError } = await supabase
      .from('app_users')
      .insert({
        supabase_uuid: user.id,
        line_account_id: `temp_${Date.now()}`,
      })
      .select('app_user_id')
      .single()

    if (userError) {
      return null
    }

    if (newUser?.app_user_id) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          app_user_id: newUser.app_user_id,
          user_name: 'New User',
          total_otaku_score: 0,
          remaining_drop: 5,
          total_otaku_layer_id: 1,
        })

      if (profileError) {
        return null
      }

      return newUser.app_user_id as number
    }
    return null
  } catch {
    return null
  }
}
