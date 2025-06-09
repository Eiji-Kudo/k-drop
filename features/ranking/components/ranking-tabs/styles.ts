import { StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'

export const styles = StyleSheet.create({
  activeTab: {
    borderBottomColor: Colors.primary,
    borderBottomWidth: 2,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  tab: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tabDivider: {
    backgroundColor: Colors.border,
    height: 24,
    width: 1,
  },
  tabText: {
    color: Colors.text.secondary,
    fontSize: 16,
  },
  tabsContainer: {
    backgroundColor: Colors.background,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
  },
  tabsScrollContent: {
    paddingHorizontal: 8,
  },
})
