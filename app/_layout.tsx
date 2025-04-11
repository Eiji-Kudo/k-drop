import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import { supabase } from '@/utils/supabase'

const queryClient = new QueryClient()

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthTypes.User | null>(null)

  useEffect(() => {
    // Handle user state changes
    function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
      setFirebaseUser(user)
      if (initializing) setInitializing(false)
    }

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber // unsubscribe on unmount
  }, [initializing])

  if (initializing) return null

  auth()
    .signInAnonymously()
    .then((userCredential) => {
      console.log('User signed in anonymously', userCredential.user.uid)
      const user = userCredential.user

      // まず既存ユーザーを検索
      supabase
        .from('app_user')
        .select('*')
        .eq('firebase_uid', user.uid)
        .then(({ data, error }) => {
          if (error) {
            console.error('Failed to check existing user:', error)
            return
          }

          if (data && data.length > 0) {
            // 既存ユーザーが見つかった場合
            console.log('User already exists in Supabase')
            return
          }

          // 新規ユーザーの場合のみ挿入
          supabase
            .from('app_user')
            .insert({ firebase_uid: user.uid, line_account_id: user.uid })
            .then(({ data, error: insertError }) => {
              if (insertError) {
                console.error('Failed to insert user into Supabase:', insertError)
              } else {
                console.log('User registered in Supabase', user.uid)
              }
            })
        })
    })
    .catch((error: FirebaseAuthTypes.NativeFirebaseAuthError) => {
      if (error.code === 'auth/operation-not-allowed') {
        console.log('Enable anonymous in your firebase console.')
      }

      console.error(error)
    })

  if (!firebaseUser) {
    console.log('ログインしていません')
  }

  console.log(firebaseUser?.uid)

  if (!loaded) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
