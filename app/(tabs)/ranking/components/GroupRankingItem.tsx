import { View, StyleSheet } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { UserGroupScoreWithDetails } from '@/repositories/rankingRepository'

type GroupRankingItemProps = {
  item: UserGroupScoreWithDetails
  index: number
}

export function GroupRankingItem({ item, index }: GroupRankingItemProps) {
  return (
    <View style={styles.rankingItem}>
      <View style={styles.rankInfo}>
        <ThemedText style={styles.rank}>#{index + 1}</ThemedText>
        <View style={styles.userInfo}>
          <ThemedText style={styles.userName}>
            {item.app_users?.user_profiles?.[0]?.user_name}
          </ThemedText>
          <ThemedText style={styles.layerName}>
            {item.group_otaku_layers?.layer_name}
          </ThemedText>
          <ThemedText style={styles.groupName}>
            {item.idol_groups?.idol_group_name}
          </ThemedText>
        </View>
      </View>
      <ThemedText style={styles.score}>{item.otaku_score}</ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  groupName: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  layerName: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
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
    borderBottomColor: '#e0e0e0',
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
  },
  userName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
})
