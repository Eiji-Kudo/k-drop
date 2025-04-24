import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import 'react-native-reanimated'

import { GlobalProvider } from '@/context/GlobalContext'

import { useColorScheme } from '@/hooks/useColorScheme'
import { signUpNewUser } from '@/utils/auth'
import { Toasts } from '@backpackapp-io/react-native-toast'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分
      gcTime: 10 * 60 * 1000, // 10分
    },
  },
})

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })
  const [isUserInitialized, setIsUserInitialized] = useState(false)

  useEffect(() => {
    async function initializeApp() {
      try {
        const userData = await signUpNewUser()
        if ('user' in userData) {
          queryClient.setQueryData(['user'], userData.user)
        }
        setIsUserInitialized(true)
      } catch {
        setIsUserInitialized(true)
      }
      try {
        await SplashScreen.hideAsync()
      } catch (error) {
        console.error(error)
      }
    }
    if (fontsLoaded) {
      initializeApp()
    }
  }, [fontsLoaded])

  if (!fontsLoaded || !isUserInitialized) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GlobalProvider>
          <GestureHandlerRootView style={styles.container}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <Toasts />
          </GestureHandlerRootView>
        </GlobalProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
