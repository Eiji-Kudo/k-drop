import { ThemedText } from '@/components/ThemedText'
import { StyleSheet, View } from 'react-native'

export function GroupSelectionHeader() {
  return (
    <View style={styles.headerContainer}>
      <ThemedText type="title">ジャンルを選択</ThemedText>
      <ThemedText type="subtitle">
        挑戦したいジャンルを選んでください
      </ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    gap: 8,
  },
})
