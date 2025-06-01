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
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 16,
  },
  tabContainer: {
    backgroundColor: Colors.background,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  tabText: {
    color: '#666',
    fontSize: 16,
  },
})
