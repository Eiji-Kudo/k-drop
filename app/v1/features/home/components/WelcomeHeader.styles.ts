import { Colors } from '@/constants/Colors'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.home.pillStrong,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeText: {
    color: Colors.tertiary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 12,
  },
  container: {
    borderColor: Colors.home.heroBorder,
    borderRadius: 32,
    borderWidth: 1,
    elevation: 10,
    gap: 18,
    padding: 22,
    shadowColor: Colors.home.heroShadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
  },
  description: {
    color: Colors.home.muted,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: '92%',
  },
  greeting: {
    color: Colors.home.ink,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  infoCard: {
    backgroundColor: Colors.home.pill,
    borderColor: Colors.home.infoBorder,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    gap: 8,
    padding: 14,
  },
  infoLabel: {
    color: Colors.home.subtle,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  levelName: {
    color: Colors.home.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  stars: {
    color: Colors.sparkle,
    fontSize: 18,
    letterSpacing: 2,
  },
  statusCard: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.home.overlay,
    borderRadius: 18,
    gap: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusLabel: {
    color: Colors.home.subtle,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textAlign: 'right',
  },
  statusValue: {
    color: Colors.home.ink,
    fontSize: 12,
    fontWeight: '600',
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
