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
  groupButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
  },
  groupButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  groupsContainer: {
    gap: 12,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  safeAreaView: {
    flex: 1,
    gap: 24,
  },
  selectedGroupButton: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
})
