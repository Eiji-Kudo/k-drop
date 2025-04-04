import { Stack } from 'expo-router'

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="group-selection" />
      <Stack.Screen name="solve-problem" />
      <Stack.Screen name="result" />
    </Stack>
  )
}
