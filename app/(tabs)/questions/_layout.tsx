import { ProblemsProvider } from '@/app/(tabs)/questions/_context/ProblemsContext'
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
