import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'

type LoadingIndicatorProps = {
  color?: string
  size?: 'small' | 'large'
}

export const LoadingIndicator = ({
  color = Colors.tint,
  size = 'large',
}: LoadingIndicatorProps) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})
