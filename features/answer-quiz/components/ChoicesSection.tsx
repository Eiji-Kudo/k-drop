import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Tables } from '@/database.types'
import { QuizChoice } from '@/features/answer-quiz/components/QuizChoice'
import { QuizVariant } from '@/features/answer-quiz/constants/quizVariant'
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ExplanationSection } from './ExplanationSection'
import { ResultModal } from './result-modal'

type DisplayStep = 'none' | 'modal' | 'explanation'

type ChoicesSectionProps = {
  quiz: Tables<'quizzes'>
  onSolved: () => void
}

export const ChoicesSection = ({ quiz, onSolved }: ChoicesSectionProps) => {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [step, setStep] = useState<DisplayStep>('none')

  const choices = [quiz.choice1, quiz.choice2, quiz.choice3, quiz.choice4]

  const isCorrect =
    selectedChoice !== null ? quiz.correct_choice === selectedChoice : null

  const handleChoiceSelection = (index: number) => {
    if (selectedChoice !== null) return

    setSelectedChoice(index + 1)
  }

  useEffect(() => {
    if (selectedChoice === null) return

    const timers = [
      // 0.6秒後にモーダルを表示
      setTimeout(() => setStep('modal'), 600),
      // 2秒後にモーダルを閉じて解説を表示
      setTimeout(() => {
        setStep('explanation')
        onSolved()
      }, 2000),
    ]

    return () => timers.forEach(clearTimeout)
  }, [selectedChoice])

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

      <ResultModal visible={step === 'modal'} isCorrect={isCorrect} />

      {step === 'explanation' && (
        <>
          <ExplanationSection explanation={quiz.explanation} />
          <View style={styles.buttonContainer}>
            <PrimaryButton onPress={onSolved}>次へ</PrimaryButton>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  choicesContainer: {
    gap: 16,
  },
  buttonContainer: {
    marginTop: 16,
  },
})
