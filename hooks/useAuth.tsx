import { supabase } from '@/utils/supabase'
import * as SecureStore from 'expo-secure-store'

export function useAuth() {
  async function signUpNewUser() {
    // Try to retrieve stored credentials
    const storedEmail = await SecureStore.getItemAsync('email')
    const storedPassword = await SecureStore.getItemAsync('password')

    if (storedEmail && storedPassword) {
      // Attempt to sign in with stored credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: storedEmail,
        password: storedPassword,
      })
      if (!signInError && signInData) {
        console.log('Sign in success with stored credentials')
        return signInData
      } else {
        console.log('Stored credentials sign in failed, proceeding to sign up')
      }
    } else {
      console.log('No stored credentials found, proceeding to sign up')
    }

    // Use default credentials for sign up
    const email = 'valid.email@supabase.io'
    const password = 'example-password'

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://example.com/welcome',
      },
    })

    if (error) {
      // If sign up fails, try signing in with the default credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) {
        throw new Error(
          `Sign up failed: ${error.message} and sign in failed: ${signInError.message}`,
        )
      }
      // Save the default credentials securely
      await SecureStore.setItemAsync('email', email)
      await SecureStore.setItemAsync('password', password)
      return signInData
    }

    // Save the default credentials securely
    await SecureStore.setItemAsync('email', email)
    await SecureStore.setItemAsync('password', password)
    return data
  }

  return { signUpNewUser }
}
