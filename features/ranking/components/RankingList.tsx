import { FlatList, View } from 'react-native'
import { TotalRankingItem } from './TotalRankingItem'
import { GroupRankingItem } from './GroupRankingItem'
import { ThemedText } from '@/components/ThemedText'
import { styles } from '../styles'
import type {
  UserProfileWithLayer,
  UserGroupScoreWithDetails,
} from '@/repositories/rankingRepository'

type RankingListProps =
  | {
      type: 'total'
      rankings: UserProfileWithLayer[]
    }
  | {
      type: 'group'
      rankings: UserGroupScoreWithDetails[]
    }

export function RankingList({ type, rankings }: RankingListProps) {
  if (type === 'total') {
    return (
      <FlatList
        data={rankings}
        renderItem={({ item, index }) => (
          <TotalRankingItem item={item} index={index} />
        )}
        keyExtractor={(_item, index) => `total-${index}`}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No rankings available</ThemedText>
          </View>
        )}
      />
    )
  }

  return (
    <FlatList
      data={rankings}
      renderItem={({ item, index }) => (
        <GroupRankingItem item={item} index={index} />
      )}
      keyExtractor={(_item, index) => `group-${index}`}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No rankings available</ThemedText>
        </View>
      )}
    />
  )
}
