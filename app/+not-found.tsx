import { Link, Stack } from 'expo-router'
import { StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/ThemedText'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 15,
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    paddingVertical: 15,
  },
})
