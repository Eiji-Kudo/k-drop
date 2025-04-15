import { supabase } from '@/utils/supabase'
import * as SecureStore from 'expo-secure-store'

export function useAuth() {
  async function storeCredentials(email: string, password: string) {
    await SecureStore.setItemAsync('email', email)
    await SecureStore.setItemAsync('password', password)
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { error }
    }
    console.log('Sign in success with credentials')
    return { data }
  }

  async function signUp(email: string, password: string) {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://example.com/welcome',
      },
    })
  }

  async function signUpNewUser() {
    const storedEmail = await SecureStore.getItemAsync('email')
    const storedPassword = await SecureStore.getItemAsync('password')

    if (storedEmail && storedPassword) {
      const { data, error } = await signIn(storedEmail, storedPassword)
      if (!error && data) {
        return data
      }
      console.log('Stored credentials sign in failed, proceeding to sign up')
    } else {
      console.log('No stored credentials found, proceeding to sign up')
    }

    const defaultEmail = 'valid.email@supabase.io'
    const defaultPassword = 'example-password'
    const { data, error } = await signUp(defaultEmail, defaultPassword)

    if (error) {
      const { data: signInData, error: signInError } = await signIn(defaultEmail, defaultPassword)
      if (signInError) {
        throw new Error(`Sign up failed: ${error.message} and sign in failed: ${signInError.message}`)
      }
      await storeCredentials(defaultEmail, defaultPassword)
      return signInData
    }

    await storeCredentials(defaultEmail, defaultPassword)
    return data
  }

  return { signUpNewUser }
}
