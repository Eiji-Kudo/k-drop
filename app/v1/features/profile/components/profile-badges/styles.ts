import { StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'

export const styles = StyleSheet.create({
  badgeIcon: {
    alignItems: 'center',
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  badgeItem: {
    alignItems: 'center',
    gap: 8,
  },
  badgeList: {},
  badgeListContent: {
    flexDirection: 'row',
    gap: 20,
  },
  badgeName: {
    fontSize: 12,
    textAlign: 'center',
  },
  container: {
    backgroundColor: Colors.background,
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    color: Colors.text.secondary,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: Colors.primary,
    fontSize: 14,
    textAlign: 'center',
  },
})
