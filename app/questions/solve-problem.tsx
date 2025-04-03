import { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Colors } from '@/constants/Colors'

export default function SolveProblemScreen() {
  const [answer] = useState('')

  const handleSubmit = () => {
    // 解答送信処理
    console.log('Submitted answer:', answer)
  }

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.headerContainer}>
          <ThemedText type="title">問題を解く</ThemedText>
          <ThemedText type="subtitle">以下の問題に解答してください</ThemedText>
        </View>

        <View style={styles.questionContainer}>
          <ThemedText style={styles.questionText}>ここに問題文が表示されます</ThemedText>
        </View>

        <View style={styles.answerContainer}>
          <ThemedText style={styles.answerLabel}>解答:</ThemedText>
          {/* 解答入力フィールドをここに追加 */}
        </View>

        <View style={styles.actionContainer}>
          <PrimaryButton onPress={handleSubmit}>解答を送信</PrimaryButton>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  actionContainer: {
    marginTop: 16,
  },
  answerContainer: {
    marginTop: 24,
  },
  answerLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  questionContainer: {
    marginTop: 24,
  },
  questionText: {
    fontSize: 18,
    lineHeight: 24,
  },
  safeAreaView: {
    flex: 1,
    gap: 24,
  },
})
