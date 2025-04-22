import { Stack } from 'expo-router'
import { StyleSheet, View } from 'react-native'

import { Colors } from '@/constants/Colors'

export default function QuizLayout() {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
})
