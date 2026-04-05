import { Colors } from '@/constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { MotiView } from 'moti'
import { StyleSheet, Text, View } from 'react-native'

type WelcomeHeaderProps = {
  levelName?: string
  levelStars?: number
}

export function WelcomeHeader({
  levelName = '軽いオタク',
  levelStars = 2,
}: WelcomeHeaderProps) {
  const stars = Array(5)
    .fill(0)
    .map((_, i) => (i < levelStars ? '★' : '☆'))
    .join('')

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
    >
      <LinearGradient
        colors={Colors.gradients.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <Text style={styles.greeting}>オタ力バトルしよう！</Text>
        <View style={styles.levelRow}>
          <Text style={styles.stars}>{stars}</Text>
          <Text style={styles.levelName}>{levelName}</Text>
        </View>
      </LinearGradient>
    </MotiView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 24,
    elevation: 2,
    gap: 8,
    padding: 24,
    shadowColor: Colors.shadowDefault,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  greeting: {
    color: Colors.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  levelName: {
    color: Colors.tertiary,
    fontSize: 16,
    fontWeight: '600',
  },
  levelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  stars: {
    color: Colors.sparkle,
    fontSize: 18,
    letterSpacing: 2,
  },
})
