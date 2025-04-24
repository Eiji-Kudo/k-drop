import { supabase } from '@/utils/supabase'

export async function signUpNewUser() {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession()

  if (sessionError) {
    throw sessionError
  }

  if (sessionData?.session) {
    return {
      session: sessionData.session,
      user: sessionData.session.user,
    }
  }

  const { data, error } = await supabase.auth.signInAnonymously()

  if (error) {
    throw error
  }

  return data
}
