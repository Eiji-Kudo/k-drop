import { ThemedText } from '@/components/ThemedText'
import { StyleSheet, View } from 'react-native'

type QuestionPromptProps = {
  prompt: string
}

export const QuestionPrompt = ({ prompt }: QuestionPromptProps) => (
  <View>
    <ThemedText style={styles.questionText}>{prompt}</ThemedText>
  </View>
)

const styles = StyleSheet.create({
  questionText: {
    fontSize: 18,
    lineHeight: 24,
  },
})
