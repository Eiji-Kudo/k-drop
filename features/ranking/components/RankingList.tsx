import { FlatList, View, StyleSheet } from 'react-native'
import { TotalRankingItem } from './TotalRankingItem'
import { GroupRankingItem } from './GroupRankingItem'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
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
            <ThemedText style={styles.emptyText}>
              No rankings available
            </ThemedText>
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
          <ThemedText style={styles.emptyText}>
            No rankings available
          </ThemedText>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: Colors.text.secondary,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
})
