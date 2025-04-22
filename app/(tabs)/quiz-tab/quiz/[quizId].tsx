import { router, useLocalSearchParams } from 'expo-router'
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Colors } from '@/constants/Colors'
import { Tables } from '@/database.types'
import { useNextQuiz } from '@/features/answer-quiz/hooks/useNextQuiz'
import { supabase } from '@/utils/supabase'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    if (mark) {
      const t = setTimeout(() => setMark(null), 2000)
      return () => clearTimeout(t)
    }
  }, [mark])

  const navigateToNextQuestionOrResult = () => {
    const next = getNextQuiz()
    router.push(next ? `/quiz-tab/quiz/${next}` : '/quiz-tab/result')
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

      <Modal visible={!!mark} transparent>
        <View style={styles.markOverlay}>
          <Text style={[styles.markText, { color: mark?.color ?? Colors.primary }]}>
            {mark?.symbol ?? ''}
          </Text>
        </View>
      </Modal>
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
  markOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    flex: 1,
    justifyContent: 'center',
  },
  markText: { fontSize: 180, fontWeight: '900' },
  questionText: { fontSize: 18, lineHeight: 24 },
  safeAreaView: { flex: 1, gap: 32 },
})
