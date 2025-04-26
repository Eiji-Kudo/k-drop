import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { QuizVariant } from '@/features/answer-quiz/constants/quizVariant'
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native'

type Props = PressableProps & {
  index: number
  label: string
  variant: QuizVariant
  style?: ViewStyle
}

export function QuizChoice({ index, label, variant, style, ...rest }: Props) {
  return (
    <Pressable
      {...rest}
      style={[
        styles.choiceButton,
        variant === QuizVariant.CORRECT && styles.choiceButtonCorrect,
        variant === QuizVariant.INCORRECT && styles.choiceButtonIncorrect,
        style,
      ]}
    >
      <ThemedText
        style={styles.choiceText}
      >{`${index + 1}. ${label}`}</ThemedText>
    </Pressable>
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
  choiceButtonIncorrect: {
    backgroundColor: Colors.toastError,
    borderColor: Colors.toastError,
  },
  choiceText: { fontSize: 16, fontWeight: '500' },
})
