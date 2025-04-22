import { ThemedText } from '@/components/ThemedText'
import { StyleSheet, View } from 'react-native'

export const QuizHeader = () => (
  <View style={styles.headerContainer}>
    <ThemedText type="title">問題を解く</ThemedText>
    <ThemedText type="subtitle">以下の問題に解答してください</ThemedText>
  </View>
)

const styles = StyleSheet.create({
  headerContainer: { 
    alignItems: 'center', 
    gap: 8 
  },
}) 