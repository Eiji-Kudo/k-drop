import { ThemedText } from '@/components/ThemedText'
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
        variant === 'correct' && styles.choiceButtonCorrect,
        variant === 'wrong' && styles.choiceButtonWrong,
        style,
      ]}
    >
      <ThemedText style={styles.choiceText}>{`${index + 1}. ${label}`}</ThemedText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  choiceButton: {
    borderColor: '#d1d1d1',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  choiceButtonCorrect: {
    backgroundColor: '#e4f5ff',
    borderColor: '#68c1f1',
  },
  choiceButtonWrong: {
    backgroundColor: '#ffecec',
    borderColor: '#f56f6f',
  },
  choiceText: { fontSize: 16, fontWeight: '500' },
})
