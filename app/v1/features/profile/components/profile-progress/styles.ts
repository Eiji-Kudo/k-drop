import { StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'

export const styles = StyleSheet.create({
  chart: {
    borderRadius: 10,
    paddingVertical: 8,
  },
  container: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  currentScore: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  header: {
    gap: 8,
  },
  percentage: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  statsContainer: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})
