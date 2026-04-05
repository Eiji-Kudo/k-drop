import { router } from 'expo-router'
import { Text, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import { BentoCard } from './BentoCard'
import { styles } from './BentoGrid.styles'
import { CreateIcon, ProfileIcon, QuizIcon, RankingIcon } from './BentoIcons'

export function BentoGrid() {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTextGroup}>
          <Text style={styles.sectionLabel}>QUICK START</Text>
          <Text style={styles.sectionTitle}>今日のメニュー</Text>
        </View>
        <Text style={styles.sectionCopy}>
          1タップで始められる入口をまとめました
        </Text>
      </View>

      <View style={styles.topRow}>
        <View style={styles.mainCard}>
          <BentoCard
            title="問題を解く"
            subtitle="最短でバトル開始。サクッとオタ力を試そう"
            eyebrow="PLAY NOW"
            icon={<QuizIcon size={30} />}
            size="large"
            variant="gradient"
            delay={100}
            showArrow
            onPress={() => router.navigate('/quiz-tab')}
          />
        </View>
        <View style={styles.sideCard}>
          <BentoCard
            title="問題を作成"
            subtitle="出題機能は準備中"
            eyebrow="準備中"
            icon={<CreateIcon color={Colors.tertiary} size={28} />}
            size="large"
            variant="rose"
            delay={200}
          />
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.halfCard}>
          <BentoCard
            title="ランキング"
            subtitle="上位プレイヤーをチェック"
            eyebrow="RANKING"
            icon={<RankingIcon color={Colors.tertiary} size={24} />}
            size="small"
            variant="gold"
            delay={300}
            showArrow
            onPress={() => router.navigate('/ranking')}
          />
        </View>
        <View style={styles.halfCard}>
          <BentoCard
            title="プロフィール"
            subtitle="戦績とバッジを見る"
            eyebrow="PROFILE"
            icon={<ProfileIcon color={Colors.accent} size={28} />}
            size="small"
            variant="accent"
            delay={400}
            showArrow
            onPress={() => router.navigate('/profile')}
          />
        </View>
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.noteLabel}>START HERE</Text>
        <Text style={styles.noteText}>
          まずは「問題を解く」から入ると、流れがつかみやすい。
        </Text>
      </View>
    </View>
  )
}
