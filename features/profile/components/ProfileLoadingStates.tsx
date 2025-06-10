import { View } from 'react-native'
import { LoadingIndicator } from '@/components/ui/LoadingIndicator'
import { ThemedText } from '@/components/ThemedText'
import { styles } from '@/app/(tabs)/profile.styles'

type ProfileLoadingStatesProps = {
  isLoading: boolean
  hasError: boolean
  hasData: boolean
}

export function ProfileLoadingStates({
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
        <ThemedText type="subtitle">Failed to load profile</ThemedText>
      </View>
    )
  }
  if (!hasData) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText type="subtitle">No profile data available</ThemedText>
      </View>
    )
  }
  return null
}