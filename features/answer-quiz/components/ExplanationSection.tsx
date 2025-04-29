import { ThemedText } from '@/components/ThemedText'
import { StyleSheet, View } from 'react-native'

type ExplanationSectionProps = {
  explanation: string
}

export const ExplanationSection = ({
  explanation,
}: ExplanationSectionProps) => (
  <View>
    <ThemedText style={styles.explanationText}>{explanation}</ThemedText>
  </View>
)

const styles = StyleSheet.create({
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
  },
})
