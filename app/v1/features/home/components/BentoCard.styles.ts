import { Colors } from '@/constants/Colors'
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 20,
    gap: 8,
    justifyContent: 'center',
    minHeight: 140,
    padding: 20,
  },
  cardDefault: {
    backgroundColor: Colors.white,
    elevation: 4,
    shadowColor: Colors.shadowDefault,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardLarge: { minHeight: 180 },
  cardSmall: { minHeight: 100, padding: 16 },
  cardWide: { minHeight: 100 },
  subtitle: { color: Colors.text.secondary, fontSize: 13, textAlign: 'center' },
  subtitleWhite: { color: Colors.secondary },
  title: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleWhite: { color: Colors.white },
})
