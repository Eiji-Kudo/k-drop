import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Tables } from '@/database.types'
import { QuizChoice } from '@/features/answer-quiz/components/QuizChoice'
import { useQuizOnSelect } from '@/features/answer-quiz/hooks/useQuizOnSelect'
import { useQuizNavigation } from '@/features/answer-quiz/hooks/useQuizNavigation'
import { useQuizChoices } from '@/features/answer-quiz/hooks/useQuizQuery'
import {
  getChoiceVariant,
  isChoiceCorrect,
} from '@/features/answer-quiz/utils/quizUtils'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ResultModal } from './result-modal'

type DisplayPhase = 'question' | 'result' | 'explanation'

type ChoicesSectionProps = {
  quiz: Tables<'quizzes'>
  testDisplayPhase?: DisplayPhase
}

export const ChoicesSection = ({
  quiz,
  testDisplayPhase,
}: ChoicesSectionProps) => {
  const { data: choices = [] } = useQuizChoices(quiz.quiz_id)

  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null)
  const [displayPhase, setDisplayPhase] = useState<DisplayPhase>(
    testDisplayPhase || 'question',
  )
  const isCorrect = isChoiceCorrect(selectedChoiceId, choices)

  const { onSelect } = useQuizOnSelect(
    quiz.quiz_id,
    setSelectedChoiceId,
    setDisplayPhase,
  )
  const { goNext } = useQuizNavigation()

  return (
    <View style={styles.choicesContainer}>
      {choices.map((choice, index) => (
        <QuizChoice
          key={choice.quiz_choice_id}
          index={index}
          label={choice.choice_text}
          variant={getChoiceVariant(index, choices, selectedChoiceId)}
          disabled={selectedChoiceId !== null}
          onPress={() => onSelect(index)}
        />
      ))}

      {displayPhase === 'result' && (
        <ResultModal visible={true} isCorrect={isCorrect} />
      )}

      {displayPhase === 'explanation' && (
        <>
          <View testID="explanation-container">
            <ThemedText style={styles.explanationText}>
              {quiz.explanation}
            </ThemedText>
          </View>
          <View style={styles.buttonContainer}>
            <PrimaryButton testID="next-button" onPress={goNext}>
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
