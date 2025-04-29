import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'

import { Colors } from '@/constants/Colors'
import { ChoicesSection } from '@/features/answer-quiz/components/ChoicesSection'
import { QuestionPrompt } from '@/features/answer-quiz/components/QuestionPrompt'
import { QuizHeader } from '@/features/answer-quiz/components/QuizHeader'
import { useNextQuiz } from '@/features/answer-quiz/hooks/useNextQuiz'
import { useQuizQuery } from '@/features/answer-quiz/hooks/useQuizQuery'

export default function QuizScreen() {
  const { getNextQuiz } = useNextQuiz()
  const { quizId } = useLocalSearchParams()

  if (typeof quizId !== 'string') throw new Error('Invalid quizId')

  const { data: quiz } = useQuizQuery(quizId)

  const handleSolved = () => {
    console.log('handleSolved')
    const next = getNextQuiz()
    console.log('next', next)
    router.push(next ? `/quiz-tab/quiz/${next}` : '/quiz-tab/result')
  }

  if (!quiz) return null

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}>
        <QuizHeader />
        <QuestionPrompt prompt={quiz.prompt} />
        <ChoicesSection quiz={quiz} onSolved={handleSolved} />
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  safeAreaView: { flex: 1, gap: 32 },
})
