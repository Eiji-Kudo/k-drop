import { Stack, Tabs } from 'expo-router'
import { Platform } from 'react-native'

import { HapticTab } from '@/components/HapticTab'
import TabBarBackground from '@/components/ui/TabBarBackground'
import { Colors } from '@/constants/Colors'
import Entypo from '@expo/vector-icons/build/Entypo'
import FontAwesome from '@expo/vector-icons/build/FontAwesome'
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5'
import Ionicons from '@expo/vector-icons/build/Ionicons'

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
