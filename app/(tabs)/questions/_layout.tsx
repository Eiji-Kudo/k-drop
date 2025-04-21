import { ProblemsProvider } from '@/context/ProblemsContext'
import { Stack } from 'expo-router'

export default function TabLayout() {
  return (
    <ProblemsProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="solve-problem" />
        <Stack.Screen name="result" />
      </Stack>
    </ProblemsProvider>
  )
}
