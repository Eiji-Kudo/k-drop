import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Tables } from '@/database.types'
import { QuizChoice } from '@/features/answer-quiz/components/QuizChoice'
import { QuizVariant } from '@/features/answer-quiz/constants/quizVariant'
import { useNextQuiz } from '@/features/answer-quiz/hooks/useNextQuiz'
import { useQuizChoices } from '@/features/answer-quiz/hooks/useQuizQuery'
import { useAppUser } from '@/hooks/useAppUser'
import { supabase } from '@/utils/supabase'
import { router } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ResultModal } from './result-modal'

type DisplayPhase = 'question' | 'result' | 'explanation'

type ChoicesSectionProps = {
  quiz: Tables<'quizzes'>
  testDisplayPhase?: DisplayPhase
}

export const ChoicesSection = (props: ChoicesSectionProps) => {
  const { quiz } = props
  const { getNextQuiz } = useNextQuiz()
  const { data: choices = [] } = useQuizChoices(quiz.quiz_id)
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null)
  const [displayPhase, setDisplayPhase] = useState<DisplayPhase>('question')
  const { appUserId } = useAppUser()

  const isCorrect =
    selectedChoiceId !== null
      ? (choices.find((c) => c.quiz_choice_id === selectedChoiceId)
          ?.is_correct ?? false)
      : null

  const handleChoiceSelection = async (index: number) => {
    if (selectedChoiceId !== null) return

    const choice = choices[index]
    setSelectedChoiceId(choice.quiz_choice_id)

    if (appUserId) {
      try {
        await supabase.from('user_quiz_answers').insert({
          app_user_id: appUserId,
          quiz_id: quiz.quiz_id,
          selected_choice: index + 1, // Keep the 1-based index for backward compatibility
          is_correct: choice.is_correct,
          answered_at: new Date().toISOString(),
        })
      } catch (error) {
        console.error('Failed to record quiz answer:', error)
      }
    } else {
      console.error('Cannot record answer: app_user_id not found')
    }

    setTimeout(() => setDisplayPhase('result'), 600)
    setTimeout(() => setDisplayPhase('explanation'), 2000)
  }

  const handleNext = () => {
    const next = getNextQuiz()
    router.push(next ? `/quiz-tab/quiz/${next.toString()}` : '/quiz-tab/result')
  }

  const getChoiceVariant = (index: number): QuizVariant => {
    if (selectedChoiceId === null) return QuizVariant.UNANSWERED

    const choice = choices[index]

    if (choice.is_correct) return QuizVariant.CORRECT
    if (choice.quiz_choice_id === selectedChoiceId) return QuizVariant.INCORRECT

    return QuizVariant.UNANSWERED
  }

  const showResultModal =
    displayPhase === 'result' || props.testDisplayPhase === 'explanation'
  const showExplanation =
    displayPhase === 'explanation' || props.testDisplayPhase === 'explanation'

  return (
    <View style={styles.choicesContainer}>
      {choices.map((choice, index) => (
        <QuizChoice
          key={choice.quiz_choice_id}
          index={index}
          label={choice.choice_text}
          variant={getChoiceVariant(index)}
          disabled={selectedChoiceId !== null}
          onPress={() => handleChoiceSelection(index)}
        />
      ))}
      {showResultModal && <ResultModal visible={true} isCorrect={isCorrect} />}
      {showExplanation && (
        <>
          <View testID="explanation-container">
            <ThemedText style={styles.explanationText}>
              {quiz.explanation}
            </ThemedText>
          </View>
          <View style={styles.buttonContainer}>
            <PrimaryButton testID="next-button" onPress={handleNext}>
              次へ
            </PrimaryButton>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: { marginTop: 16 },
  choicesContainer: { gap: 16 },
  explanationText: { fontSize: 14, lineHeight: 20 },
})
