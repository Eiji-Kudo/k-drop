import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Colors } from '@/constants/Colors'
import { Tables } from '@/database.types'
import { useNextQuiz } from '@/features/answer-quiz/hooks/useNextQuiz'
import { supabase } from '@/utils/supabase'
import { useQuery } from '@tanstack/react-query'

export default function QuizScreen() {
  const { getNextQuiz } = useNextQuiz()
  const { quizId } = useLocalSearchParams()

  if (typeof quizId !== 'string') {
    throw new Error('Invalid quizId: must be a string')
  }

  console.log('quizId', quizId)

  const { data: quiz } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const { data, error } = await supabase.from('quiz').select('*').eq('quiz_id', quizId).single()
      if (error) throw new Error(error.message)
      return data as Tables<'quiz'>
    },
    enabled: !!quizId,
  })

  console.log('quiz', quiz)

  const navigateToNextQuestionOrResult = () => {
    const nextQuizId = getNextQuiz()
    if (nextQuizId) {
      router.push(`/questions/quiz/${nextQuizId}`)
    } else {
      router.push('/questions/result')
    }
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
          <PrimaryButton onPress={navigateToNextQuestionOrResult}>解答を送信</PrimaryButton>
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
