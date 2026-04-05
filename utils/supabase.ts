import { Database } from '@/database.types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import 'react-native-url-polyfill/auto'

const supabaseUrl: string = Constants.expoConfig?.extra?.supabaseUrl ?? ''
const supabaseAnonKey: string =
  Constants.expoConfig?.extra?.supabaseAnonKey ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL and anon key must be provided in environment variables',
  )
}

const isServer = Platform.OS === 'web' && typeof window === 'undefined'

const noopStorage = {
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isServer ? noopStorage : AsyncStorage,
    autoRefreshToken: true,
    persistSession: !isServer,
    detectSessionInUrl: false,
  },
})
