import { View } from 'react-native'
import { LoadingIndicator } from '@/components/ui/LoadingIndicator'
import { ThemedText } from '@/components/ThemedText'
import { styles } from '@/app/(tabs)/profile.styles'

type ProfileLoadingStatesProps = {
  isLoading: boolean
  hasError: boolean
  hasData: boolean
}

export function getProfileLoadingState({
  isLoading,
  hasError,
  hasData,
}: ProfileLoadingStatesProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingIndicator />
      </View>
    )
  }
  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText type="subtitle">
          プロフィールの読み込みに失敗しました
        </ThemedText>
      </View>
    )
  }
  if (!hasData) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText type="subtitle">プロフィールデータがありません</ThemedText>
      </View>
    )
  }
  return null
}
