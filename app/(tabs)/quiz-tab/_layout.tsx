import { Stack } from 'expo-router'

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="quiz/[quizId]" />
      <Stack.Screen name="result" />
    </Stack>
  )
}
