import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'

import { Colors } from '@/constants/Colors'
import { useGlobalContext } from '@/context/GlobalContext'
import { ChoicesSection } from '@/features/answer-quiz/components/ChoicesSection'
import { QuestionPrompt } from '@/features/answer-quiz/components/QuestionPrompt'
import { QuizHeader } from '@/features/answer-quiz/components/QuizHeader'
import { useQuizQuery } from '@/features/answer-quiz/hooks/useQuizQuery'
import { useEffect } from 'react'

export default function QuizScreen() {
  const { quizId } = useLocalSearchParams()
  const { setAnsweredQuizIds } = useGlobalContext()

  if (typeof quizId !== 'string') throw new Error('Invalid quizId')

  useEffect(() => {
    setAnsweredQuizIds((prev) => {
      if (prev.includes(Number(quizId))) {
        return prev
      }
      return [...prev, Number(quizId)]
    })
  }, [quizId, setAnsweredQuizIds])

  const { data: quiz } = useQuizQuery(quizId)

  if (!quiz) return null

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}>
        <QuizHeader />
        <QuestionPrompt prompt={quiz.prompt} />
        <ChoicesSection quiz={quiz} />
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
