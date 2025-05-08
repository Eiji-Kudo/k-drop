import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Tables } from '@/database.types'
import { QuizChoice } from '@/features/answer-quiz/components/QuizChoice'
import { QuizVariant } from '@/features/answer-quiz/constants/quizVariant'
import { useNextQuiz } from '@/features/answer-quiz/hooks/useNextQuiz'
import { useAppUser } from '@/hooks/useAppUser'
import { supabase } from '@/utils/supabase'
import { router } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ResultModal } from './result-modal'

type DisplayPhase = 'question' | 'result' | 'explanation'

type ChoicesSectionProps = {
  quiz: Tables<'quizzes'>
}

export const ChoicesSection = ({ quiz }: ChoicesSectionProps) => {
  const { getNextQuiz } = useNextQuiz()
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [displayPhase, setDisplayPhase] = useState<DisplayPhase>('question')
  const { appUserId } = useAppUser()

  const choices = [quiz.choice1, quiz.choice2, quiz.choice3, quiz.choice4]
  const isCorrect =
    selectedChoice !== null ? quiz.correct_choice === selectedChoice : null

  const handleChoiceSelection = async (index: number) => {
    if (selectedChoice !== null) return
    const choiceNumber = index + 1
    setSelectedChoice(choiceNumber)

    if (appUserId) {
      const isAnswerCorrect = quiz.correct_choice === choiceNumber

      try {
        await supabase.from('user_quiz_answers').insert({
          app_user_id: appUserId,
          quiz_id: quiz.quiz_id,
          selected_choice: choiceNumber,
          is_correct: isAnswerCorrect,
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
    router.push(next ? `/quiz-tab/quiz/${next}` : '/quiz-tab/result')
  }

  const getChoiceVariant = (index: number): QuizVariant => {
    if (selectedChoice === null) return QuizVariant.UNANSWERED
    const choiceNum = index + 1
    if (quiz.correct_choice === choiceNum) return QuizVariant.CORRECT
    if (selectedChoice === choiceNum) return QuizVariant.INCORRECT
    return QuizVariant.UNANSWERED
  }

  return (
    <View style={styles.choicesContainer}>
      {choices.map((choice, index) => (
        <QuizChoice
          key={index}
          index={index}
          label={choice}
          variant={getChoiceVariant(index)}
          disabled={selectedChoice !== null}
          onPress={() => handleChoiceSelection(index)}
        />
      ))}
      <ResultModal visible={displayPhase === 'result'} isCorrect={isCorrect} />
      {displayPhase === 'explanation' && (
        <>
          <View>
            <ThemedText style={styles.explanationText}>
              {quiz.explanation}
            </ThemedText>
          </View>
          <View style={styles.buttonContainer}>
            <PrimaryButton onPress={handleNext}>次へ</PrimaryButton>
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
