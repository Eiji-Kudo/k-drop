import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'
import * as SecureStore from 'expo-secure-store'

import { useColorScheme } from '@/hooks/useColorScheme'
import { supabase } from '@/utils/supabase'

const queryClient = new QueryClient()

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    async function initializeApp() {
      try {
        const data = await signUpNewUser();
        console.log('Sign up success:', data);
      } catch (error) {
        console.error('Sign up error:', error);
      }
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error(error);
      }
    }
    if (fontsLoaded) {
      initializeApp();
    }
  }, [fontsLoaded])

  async function signUpNewUser() {
    const email = 'valid.email@supabase.io';
    const password = 'example-password';
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://example.com/welcome',
      },
    });

    if (error) {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        throw new Error(`Signup failed: ${error.message} and sign in failed: ${signInError.message}`);
      }
      // Save credentials securely
      await SecureStore.setItemAsync('email', email);
      await SecureStore.setItemAsync('password', password);
      return signInData;
    }

    // Save credentials securely
    await SecureStore.setItemAsync('email', email);
    await SecureStore.setItemAsync('password', password);
    return data;
  }

  if (!fontsLoaded) {
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