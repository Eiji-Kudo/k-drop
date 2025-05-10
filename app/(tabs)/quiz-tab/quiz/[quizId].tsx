import { useLocalSearchParams, useNavigation } from 'expo-router'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Colors } from '@/constants/Colors'
import { useGlobalContext } from '@/context/GlobalContext'
import { ChoicesSection } from '@/features/answer-quiz/components/ChoicesSection'
import { QuestionPrompt } from '@/features/answer-quiz/components/QuestionPrompt'
import { QuizHeader } from '@/features/answer-quiz/components/QuizHeader'
import { useQuiz } from '@/features/answer-quiz/hooks/useQuizQuery'
import { useEffect } from 'react'

function QuizScreenContent() {
  const params = useLocalSearchParams()
  const { setAnsweredQuizIds } = useGlobalContext()
  const navigation = useNavigation()

  const quizIdParam = Array.isArray(params.quizId)
    ? params.quizId[0]
    : params.quizId
  const quizId = Number(quizIdParam)

  if (isNaN(quizId)) throw new Error('Invalid quizId')

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    })

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      })
    }
  }, [navigation])

  useEffect(() => {
    setAnsweredQuizIds((prev) => {
      if (prev.includes(quizId)) {
        return prev
      }
      return [...prev, quizId]
    })
  }, [quizId, setAnsweredQuizIds])

  const { data: quiz } = useQuiz(quizId)

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

export default function QuizScreen() {
  return (
    <ErrorBoundary>
      <QuizScreenContent />
    </ErrorBoundary>
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
