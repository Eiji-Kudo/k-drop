import { ThemedText } from '@/components/ThemedText'
import { View } from 'react-native'
import { styles } from './styles'

export function GroupSelectionHeader() {
  return (
    <View style={styles.headerContainer}>
      <ThemedText type="title">ジャンルを選択</ThemedText>
      <ThemedText type="subtitle">挑戦したいジャンルを選んでください</ThemedText>
    </View>
  )
}
