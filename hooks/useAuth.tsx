import { supabase } from '@/utils/supabase'

export function useAuth() {
  async function signUpNewUser() {
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData?.session) {
      return sessionData
    }

    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) throw error

    return data
  }

  return { signUpNewUser }
}
