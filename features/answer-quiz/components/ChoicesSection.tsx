import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Tables } from '@/database.types'
import { QuizChoice } from '@/features/answer-quiz/components/QuizChoice'
import { useQuizPhase } from '@/features/answer-quiz/hooks/useQuizPhase'
import { useQuizAnswer } from '@/features/answer-quiz/hooks/useQuizAnswer'
import { useQuizNavigation } from '@/features/answer-quiz/hooks/useQuizNavigation'
import { useQuizChoices } from '@/features/answer-quiz/hooks/useQuizQuery'
import { getChoiceVariant } from '@/features/answer-quiz/utils/quizUtils'
import { StyleSheet, View } from 'react-native'
import { ResultModal } from './result-modal'

type ChoicesSectionProps = {
  quiz: Tables<'quizzes'>
  testDisplayPhase?: 'question' | 'result' | 'explanation'
}

export const ChoicesSection = (props: ChoicesSectionProps) => {
  const { quiz, testDisplayPhase } = props
  const { data: choices = [] } = useQuizChoices(quiz.quiz_id)
  const quizPhase = useQuizPhase(choices, testDisplayPhase)
  const { onSelect } = useQuizAnswer(quiz.quiz_id, choices, quizPhase)
  const { goNext } = useQuizNavigation()

  const { selectedChoiceId, displayPhase, isCorrect } = quizPhase

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
