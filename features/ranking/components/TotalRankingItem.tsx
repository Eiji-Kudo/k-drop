import { View, StyleSheet } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { UserProfileWithLayer } from '@/repositories/rankingRepository'

type TotalRankingItemProps = {
  item: UserProfileWithLayer
  index: number
}

export function TotalRankingItem({ item, index }: TotalRankingItemProps) {
  return (
    <View style={styles.rankingItem}>
      <View style={styles.rankInfo}>
        <ThemedText style={styles.rank}>#{index + 1}</ThemedText>
        <View style={styles.userInfo}>
          <ThemedText style={styles.userName}>{item.user_name}</ThemedText>
          <ThemedText style={styles.layerName}>
            {item.total_otaku_layers?.layer_name}
          </ThemedText>
        </View>
      </View>
      <ThemedText style={styles.score}>{item.total_otaku_score}</ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  layerName: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  rank: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    width: 50,
  },
  rankInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  rankingItem: {
    alignItems: 'center',
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  score: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
})
