import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { StyleSheet, View } from 'react-native'

type ExplanationSectionProps = {
  explanation: string
  onNextPress: () => void
}

export const ExplanationSection = ({ explanation, onNextPress }: ExplanationSectionProps) => (
  <>
    <View>
      <ThemedText style={styles.explanationText}>{explanation}</ThemedText>
    </View>
    <View>
      <PrimaryButton onPress={onNextPress}>次へ</PrimaryButton>
    </View>
  </>
)

const styles = StyleSheet.create({
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
  },
})
