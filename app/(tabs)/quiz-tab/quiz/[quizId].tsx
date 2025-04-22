import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Tables } from '@/database.types'
import { ResultModal } from '@/features/answer-quiz/components/result-modal'
import { useNextQuiz } from '@/features/answer-quiz/hooks/useNextQuiz'
import { supabase } from '@/utils/supabase'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { QuizChoice } from './QuizChoice'

export default function QuizScreen() {
  const { getNextQuiz } = useNextQuiz()
  const { quizId } = useLocalSearchParams()

  if (typeof quizId !== 'string') throw new Error('Invalid quizId')

  const { data: quiz } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const { data, error } = await supabase.from('quiz').select('*').eq('quiz_id', quizId).single()
      if (error) throw new Error(error.message)
      return data as Tables<'quiz'>
    },
    enabled: !!quizId,
  })

  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [buttonsLocked, setButtonsLocked] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [mark, setMark] = useState<{ symbol: '◎' | '×'; color: string } | null>(null)

  const navigateToNextQuestionOrResult = () => {
    const next = getNextQuiz()
    router.push(next ? `/quiz-tab/quiz/${next}` : '/quiz-tab/result')
    setMark(null)
  }

  if (!quiz) return null

  const choices = [quiz.choice1, quiz.choice2, quiz.choice3, quiz.choice4]

  return (
    <>
      <ScrollView style={styles.container}>
        <SafeAreaView style={styles.safeAreaView}>
          <View style={styles.headerContainer}>
            <ThemedText type="title">問題を解く</ThemedText>
            <ThemedText type="subtitle">以下の問題に解答してください</ThemedText>
          </View>

          <View>
            <ThemedText style={styles.questionText}>{quiz.prompt}</ThemedText>
          </View>

          <View style={styles.choicesContainer}>
            {choices.map((c, i) => {
              let variant: 'default' | 'correct' | 'wrong' = 'default'
              if (buttonsLocked && quiz.correct_choice === i + 1) variant = 'correct'
              else if (buttonsLocked && selectedChoice === i + 1) variant = 'wrong'
              return (
                <QuizChoice
                  key={i}
                  index={i}
                  label={c}
                  variant={variant}
                  disabled={buttonsLocked}
                  onPress={() => {
                    if (buttonsLocked) return
                    setSelectedChoice(i + 1)
                    setButtonsLocked(true)
                    setMark({
                      symbol: quiz.correct_choice === i + 1 ? '◎' : '×',
                      color: quiz.correct_choice === i + 1 ? '#68c1f1' : '#f56f6f',
                    })
                    setTimeout(() => setShowExplanation(true), 600)
                    setTimeout(() => setMark(null), 2000)
                  }}
                />
              )
            })}
          </View>

          {showExplanation && (
            <>
              <View>
                <ThemedText style={styles.explanationText}>{quiz.explanation}</ThemedText>
              </View>
              <View>
                <PrimaryButton onPress={navigateToNextQuestionOrResult}>次へ</PrimaryButton>
              </View>
            </>
          )}
        </SafeAreaView>
      </ScrollView>

      <ResultModal visible={!!mark} mark={mark} />
    </>
  )
}

const styles = StyleSheet.create({
  choicesContainer: { gap: 16 },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 24 },
  explanationText: { fontSize: 14, lineHeight: 20 },
  headerContainer: { alignItems: 'center', gap: 8 },
  questionText: { fontSize: 18, lineHeight: 24 },
  safeAreaView: { flex: 1, gap: 32 },
})
