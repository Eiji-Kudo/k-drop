import { StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'

export const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  description: { color: Colors.text.primary, fontSize: 14, lineHeight: 20 },
  descriptionContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  errorContainer: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  loadingContainer: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  scrollView: { flex: 1 },
})