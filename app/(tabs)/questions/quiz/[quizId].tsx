import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Colors } from '@/constants/Colors'
import { useGlobalContext } from '@/context/GlobalContext'

export default function QuizScreen() {
  const { quizId } = useLocalSearchParams()
  console.log('quizId', quizId)
  const currentProblemId = Number(quizId) || 1
  const { selectedQuizIds } = useGlobalContext()
  const currentProblem = selectedQuizIds.find((quizId) => quizId === currentProblemId)

  const handleSubmit = () => {
    const nextProblem = selectedQuizIds.find((p) => p === currentProblemId + 1)
    if (nextProblem) {
      router.replace(`/questions/quiz/${nextProblem}`)
    } else {
      router.replace('/questions/result')
    }
  }

  if (!currentProblem) {
    router.replace('/questions/result')
    return null
  }

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.headerContainer}>
          <ThemedText type="title">問題を解く</ThemedText>
          <ThemedText type="subtitle">以下の問題に解答してください</ThemedText>
        </View>

        <View style={styles.questionContainer}>
          <ThemedText style={styles.questionText}>問題文</ThemedText>
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
