import { StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'

export function LevelDisplay() {
  return (
    <View style={styles.levelContainer}>
      <ThemedText type="subtitle">あなたは</ThemedText>
      <ThemedText type="subtitle">「軽いオタクレベル」です。</ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  levelContainer: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
  },
})
