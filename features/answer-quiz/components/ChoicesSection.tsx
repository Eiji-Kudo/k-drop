import { QuizChoice } from '@/features/answer-quiz/components/QuizChoice'
import { StyleSheet, View } from 'react-native'

type ChoiceVariant = 'default' | 'correct' | 'wrong'

type ChoicesSectionProps = {
  choices: string[]
  getVariant: (index: number) => ChoiceVariant
  onChoicePress: (index: number) => void
  disabled: boolean
}

export const ChoicesSection = ({
  choices,
  getVariant,
  onChoicePress,
  disabled,
}: ChoicesSectionProps) => (
  <View style={styles.choicesContainer}>
    {choices.map((choice, index) => (
      <QuizChoice
        key={index}
        index={index}
        label={choice}
        variant={getVariant(index)}
        disabled={disabled}
        onPress={() => onChoicePress(index)}
      />
    ))}
  </View>
)

const styles = StyleSheet.create({
  choicesContainer: {
    gap: 16,
  },
})
