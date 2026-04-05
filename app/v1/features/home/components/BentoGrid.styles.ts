import { Colors } from '@/constants/Colors'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  bottomRow: { flexDirection: 'row', gap: 12 },
  container: { gap: 16 },
  halfCard: { flex: 1 },
  mainCard: { flex: 1.2 },
  noteCard: {
    backgroundColor: Colors.home.pillStrong,
    borderColor: Colors.home.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 6,
    padding: 16,
    shadowColor: Colors.home.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  noteLabel: {
    color: Colors.home.subtle,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  noteText: {
    color: Colors.home.ink,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  sectionCopy: {
    color: Colors.home.muted,
    fontSize: 12,
    lineHeight: 18,
    maxWidth: 132,
    textAlign: 'right',
  },
  sectionHeader: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sectionLabel: {
    color: Colors.home.subtle,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  sectionTextGroup: {
    gap: 2,
  },
  sectionTitle: {
    color: Colors.home.ink,
    fontSize: 22,
    fontWeight: '700',
  },
  sideCard: { flex: 0.8 },
  topRow: { flexDirection: 'row', gap: 12 },
})
