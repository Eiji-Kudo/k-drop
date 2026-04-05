import { Colors } from '@/constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { MotiView } from 'moti'
import { Text, View } from 'react-native'
import { styles } from './WelcomeHeader.styles'

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
        colors={Colors.gradients.hero}
        start={{ x: 0.05, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>K-DROP HOME</Text>
          </View>
          <View style={styles.statusCard}>
            <Text style={styles.statusLabel}>TODAY</Text>
            <Text style={styles.statusValue}>推し知識をチャージ</Text>
          </View>
        </View>
        <Text style={styles.greeting}>オタ力バトルしよう！</Text>
        <Text style={styles.description}>
          クイズに挑戦して、ランキングとプロフィールを育てよう。
        </Text>
        <View style={styles.bottomRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>LEVEL</Text>
            <Text style={styles.levelName}>{levelName}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>OTAKU POWER</Text>
            <Text style={styles.stars}>{stars}</Text>
          </View>
        </View>
      </LinearGradient>
    </MotiView>
  )
}
