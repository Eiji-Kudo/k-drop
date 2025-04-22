import { Tabs } from 'expo-router'
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
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color }: { color: string }) => (
            <Entypo name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="quiz-tab"
        options={{
          title: '問題を解く',
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome name="pencil-square-o" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: 'ランキング',
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome5 name="chess-king" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'プロフィール',
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="person-circle" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
