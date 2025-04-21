import { Colors } from '@/constants/Colors'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  actionContainer: { marginTop: 16 },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  groupsContainer: {
    gap: 12,
  },
  safeAreaView: {
    flex: 1,
    gap: 24,
  },
})
