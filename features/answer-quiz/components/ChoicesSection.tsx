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
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const choices = [quiz.choice1, quiz.choice2, quiz.choice3, quiz.choice4]

  // 派生値として正誤を計算
  const isCorrect =
    selectedChoice !== null ? quiz.correct_choice === selectedChoice : null

  const handleChoiceSelection = (index: number) => {
    if (selectedChoice !== null) return

    const choiceNum = index + 1
    setSelectedChoice(choiceNum)

    // 説明表示
    setTimeout(() => setShowExplanation(true), 600)
    // リセット＆次へ
    setTimeout(() => {
      setShowExplanation(false)
      // setSelectedChoice(null)
      onSolved()
    }, 2000)
  }

  const getChoiceVariant = (index: number): ChoiceVariant => {
    if (selectedChoice === null) return 'default'

    const choiceNum = index + 1
    if (quiz.correct_choice === choiceNum) return 'correct'
    if (selectedChoice === choiceNum) return 'wrong'
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
          disabled={selectedChoice !== null}
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
