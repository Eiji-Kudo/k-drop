import { StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  emptyText: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  groupImage: {
    borderRadius: 30,
    height: 60,
    width: 60,
  },
  groupImagePlaceholder: {
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  groupItem: {
    alignItems: 'center',
    gap: 4,
  },
  groupName: {
    fontSize: 12,
    maxWidth: 80,
    textAlign: 'center',
  },
  placeholderText: {
    color: Colors.text.tertiary,
    fontSize: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
})
