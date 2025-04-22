import { router, useLocalSearchParams } from 'expo-router'
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

import { ResultModal } from '@/features/answer-quiz/components/result-modal'
import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Colors } from '@/constants/Colors'
import { Tables } from '@/database.types'
import { useNextQuiz } from '@/features/answer-quiz/hooks/useNextQuiz'
import { supabase } from '@/utils/supabase'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

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
              const isSelected = selectedChoice === i + 1
              const isCorrect = quiz.correct_choice === i + 1
              return (
                <Pressable
                  key={i}
                  disabled={buttonsLocked}
                  onPress={() => {
                    if (buttonsLocked) return
                    setSelectedChoice(i + 1)
                    setButtonsLocked(true)
                    setMark({
                      symbol: isCorrect ? '◎' : '×',
                      color: isCorrect ? Colors.primary : Colors.toastError,
                    })
                    setTimeout(() => setShowExplanation(true), 600)
                    setTimeout(() => setMark(null), 2000)
                  }}
                  style={[
                    styles.choiceButton,
                    buttonsLocked && isCorrect && styles.choiceButtonCorrect,
                    buttonsLocked && isSelected && !isCorrect && styles.choiceButtonWrong,
                  ]}
                >
                  <ThemedText style={styles.choiceText}>{`${i + 1}. ${c}`}</ThemedText>
                </Pressable>
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
  choiceButton: {
    borderColor: Colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  choiceButtonCorrect: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.primary,
  },
  choiceButtonWrong: {
    backgroundColor: Colors.toastError,
    borderColor: Colors.toastError,
  },
  choiceText: { fontSize: 16, fontWeight: '500' },
  choicesContainer: { gap: 16 },
  container: { backgroundColor: Colors.background, flex: 1, paddingHorizontal: 16, paddingTop: 24 },
  explanationText: { fontSize: 14, lineHeight: 20 },
  headerContainer: { alignItems: 'center', gap: 8 },
  questionText: { fontSize: 18, lineHeight: 24 },
  safeAreaView: { flex: 1, gap: 32 },
})
