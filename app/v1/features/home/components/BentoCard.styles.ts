import { Colors } from '@/constants/Colors'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  arrowBadge: {
    alignItems: 'center',
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  card: {
    borderRadius: 28,
    gap: 14,
    justifyContent: 'space-between',
    minHeight: 156,
    padding: 18,
  },
  cardDefault: {
    borderWidth: 1,
    elevation: 8,
    shadowColor: Colors.home.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
  },
  cardDisabled: {
    opacity: 0.72,
    shadowOpacity: 0.05,
  },
  cardGradient: {
    borderWidth: 1,
    elevation: 12,
    shadowColor: Colors.home.cardShadowStrong,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
  },
  cardLarge: {
    minHeight: 208,
    padding: 20,
  },
  cardSmall: {
    minHeight: 132,
    padding: 18,
  },
  cardWide: {
    minHeight: 116,
    padding: 18,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconBadge: {
    alignItems: 'center',
    borderRadius: 18,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  iconBadgeLarge: {
    borderRadius: 20,
    height: 56,
    width: 56,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  subtitleLarge: {
    fontSize: 14,
    lineHeight: 20,
  },
  textStack: {
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  titleLarge: {
    fontSize: 26,
    lineHeight: 32,
  },
  titleSmall: {
    fontSize: 18,
    lineHeight: 24,
  },
})
