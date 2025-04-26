import { Tables } from '@/database.types'
import { QuizChoice } from '@/features/answer-quiz/components/QuizChoice'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ExplanationSection } from './ExplanationSection'
import { ResultModal } from './result-modal'

type ChoiceVariant = 'default' | 'correct' | 'wrong'

type ChoicesSectionProps = {
  quiz: Tables<'quiz'>
  onSolved: () => void
}

export const ChoicesSection = ({ quiz, onSolved }: ChoicesSectionProps) => {
  const [selected, setSelected] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const choices = [quiz.choice1, quiz.choice2, quiz.choice3, quiz.choice4]

  const handleChoiceSelection = (choiceIndex: number) => {
    if (locked) return

    const selectedChoiceNumber = choiceIndex + 1
    setSelected(selectedChoiceNumber)
    setLocked(true)

    const isAnswerCorrect = quiz.correct_choice === selectedChoiceNumber
    setIsCorrect(isAnswerCorrect)

    setTimeout(() => setShowExplanation(true), 600)
    setTimeout(() => setIsCorrect(null), 2000)
  }

  const getChoiceVariant = (choiceIndex: number): ChoiceVariant => {
    if (!locked) return 'default'

    const choiceNumber = choiceIndex + 1
    if (quiz.correct_choice === choiceNumber) return 'correct'
    if (selected === choiceNumber) return 'wrong'
    return 'default'
  }

  return (
    <View style={styles.choicesContainer}>
      {choices.map((choice, index) => (
        <QuizChoice
          key={index}
          index={index}
          label={choice}
          variant={getChoiceVariant(index)}
          disabled={locked}
          onPress={() => handleChoiceSelection(index)}
        />
      ))}

      <ResultModal isCorrect={isCorrect} />

      {showExplanation && (
        <ExplanationSection
          explanation={quiz.explanation}
          onNextPress={onSolved}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  choicesContainer: {
    gap: 16,
  },
})
