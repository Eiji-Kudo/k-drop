import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native'

type Variant = 'default' | 'correct' | 'wrong'

type Props = PressableProps & {
  index: number
  label: string
  variant: Variant
  style?: ViewStyle
}

export function QuizChoice({ index, label, variant, style, ...rest }: Props) {
  return (
    <Pressable
      {...rest}
      style={[
        styles.choiceButton,
        // TODO: correct, wrongという文字列での判定を避ける
        variant === 'correct' && styles.choiceButtonCorrect,
        variant === 'wrong' && styles.choiceButtonWrong,
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
  choiceButtonWrong: {
    backgroundColor: Colors.toastError,
    borderColor: Colors.toastError,
  },
  choiceText: { fontSize: 16, fontWeight: '500' },
})
