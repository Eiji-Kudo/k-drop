import { Database } from '@/database.types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'
import 'react-native-url-polyfill/auto'

const supabaseUrl: string = Constants.expoConfig?.extra?.supabaseUrl ?? ''
const supabaseAnonKey: string =
  Constants.expoConfig?.extra?.supabaseAnonKey ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL and anon key must be provided in environment variables',
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
