import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'

import { Colors } from '@/constants/Colors'
import { ChoicesSection } from '@/features/answer-quiz/components/ChoicesSection'
import { ExplanationSection } from '@/features/answer-quiz/components/ExplanationSection'
import { QuestionPrompt } from '@/features/answer-quiz/components/QuestionPrompt'
import { QuizHeader } from '@/features/answer-quiz/components/QuizHeader'
import { ResultModal } from '@/features/answer-quiz/components/result-modal'
import { useNextQuiz } from '@/features/answer-quiz/hooks/useNextQuiz'
import { useQuizQuery } from '@/features/answer-quiz/hooks/useQuizQuery'
import { useState } from 'react'

type ChoiceVariant = 'default' | 'correct' | 'wrong'

export default function QuizScreen() {
  const { getNextQuiz } = useNextQuiz()
  const { quizId } = useLocalSearchParams()

  if (typeof quizId !== 'string') throw new Error('Invalid quizId')

  const { data: quiz } = useQuizQuery(quizId)

  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [buttonsLocked, setButtonsLocked] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [mark, setMark] = useState<{ symbol: '◎' | '×'; color: string } | null>(
    null,
  )

  const navigateToNextQuestionOrResult = () => {
    const next = getNextQuiz()
    router.push(next ? `/quiz-tab/quiz/${next}` : '/quiz-tab/result')
    setMark(null)
  }

  const handleChoiceSelection = (choiceIndex: number) => {
    if (buttonsLocked || !quiz) return

    const selectedChoiceNumber = choiceIndex + 1
    setSelectedChoice(selectedChoiceNumber)
    setButtonsLocked(true)

    const isCorrect = quiz.correct_choice === selectedChoiceNumber
    setMark({
      symbol: isCorrect ? '◎' : '×',
      color: isCorrect ? '#68c1f1' : '#f56f6f',
    })

    setTimeout(() => setShowExplanation(true), 600)
    setTimeout(() => setMark(null), 2000)
  }

  const getChoiceVariant = (choiceIndex: number): ChoiceVariant => {
    if (!buttonsLocked || !quiz) return 'default'

    const choiceNumber = choiceIndex + 1
    if (quiz.correct_choice === choiceNumber) return 'correct'
    if (selectedChoice === choiceNumber) return 'wrong'
    return 'default'
  }

  if (!quiz) return null

  const choices = [quiz.choice1, quiz.choice2, quiz.choice3, quiz.choice4]

  return (
    <>
      <ScrollView style={styles.container}>
        <SafeAreaView style={styles.safeAreaView}>
          <QuizHeader />
          <QuestionPrompt prompt={quiz.prompt} />
          <ChoicesSection
            choices={choices}
            getVariant={getChoiceVariant}
            onChoicePress={handleChoiceSelection}
            disabled={buttonsLocked}
          />

          {showExplanation && (
            <ExplanationSection
              explanation={quiz.explanation}
              onNextPress={navigateToNextQuestionOrResult}
            />
          )}
        </SafeAreaView>
      </ScrollView>

      <ResultModal visible={!!mark} mark={mark} />
    </>
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
