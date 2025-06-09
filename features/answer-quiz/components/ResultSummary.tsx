import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { StyleSheet, View } from 'react-native'

type ResultSummaryProps = {
  totalScore: number
  correctCount: number
  totalQuestions: number
}

export function ResultSummary({
  totalScore,
  correctCount,
  totalQuestions,
}: ResultSummaryProps) {
  return (
    <View style={styles.resultContainer}>
      <ThemedText style={styles.scoreText}>スコア: {totalScore}点</ThemedText>
      <ThemedText style={styles.resultSummary}>
        {totalQuestions}問中{correctCount}問正解
      </ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  resultContainer: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 8,
    gap: 8,
    padding: 16,
  },
  resultSummary: {
    fontSize: 16,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
})
