import { Stack } from 'expo-router'

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="group-selection"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="difficulty"
        options={{
          title: '難易度選択',
          headerShown: true,
        }}
      />
    </Stack>
  )
}
