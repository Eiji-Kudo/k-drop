import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { GlobalProvider } from '@/app/_context/GlobalContext'
import { useAuth } from '@/hooks/useAuth'
import { useColorScheme } from '@/hooks/useColorScheme'
const queryClient = new QueryClient()

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })
  const { signUpNewUser } = useAuth()

  useEffect(() => {
    async function initializeApp() {
      try {
        await signUpNewUser()
      } catch (error) {
        console.error('Sign up error:', error)
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
  }, [fontsLoaded, signUpNewUser])

  if (!fontsLoaded) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GlobalProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </GlobalProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
