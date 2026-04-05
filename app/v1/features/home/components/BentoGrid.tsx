import { router } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import { BentoCard } from './BentoCard'
import { CreateIcon, ProfileIcon, QuizIcon, RankingIcon } from './BentoIcons'

export function BentoGrid() {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.mainCard}>
          <BentoCard
            title="問題を解く"
            subtitle="クイズに挑戦"
            icon={<QuizIcon />}
            size="large"
            variant="gradient"
            delay={100}
            onPress={() => router.navigate('/quiz-tab')}
          />
        </View>
        <View style={styles.sideCard}>
          <BentoCard
            title="問題を作成"
            icon={<CreateIcon />}
            size="medium"
            variant="default"
            delay={200}
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.halfCard}>
          <BentoCard
            title="ランキング"
            icon={<RankingIcon />}
            size="small"
            variant="default"
            delay={300}
            onPress={() => router.navigate('/ranking')}
          />
        </View>
        <View style={styles.halfCard}>
          <BentoCard
            title="プロフィール"
            icon={<ProfileIcon />}
            size="small"
            variant="default"
            delay={400}
            onPress={() => router.navigate('/profile')}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bottomRow: { flexDirection: 'row', gap: 12 },
  container: { gap: 12 },
  halfCard: { flex: 1 },
  mainCard: { flex: 1.2 },
  sideCard: { flex: 0.8 },
  topRow: { flexDirection: 'row', gap: 12 },
})
