import { useState } from 'react'
import { View, ActivityIndicator, FlatList } from 'react-native'
import { rankingRepository } from '@/repositories/rankingRepository'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { useQuery } from '@tanstack/react-query'
import { TotalRankingItem } from './ranking/components/TotalRankingItem'
import { GroupRankingItem } from './ranking/components/GroupRankingItem'
import { GroupSelector } from './ranking/components/GroupSelector'
import { RankingTabs } from './ranking/components/RankingTabs'
import { styles } from './ranking/styles'

export default function RankingScreen() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'total' | 'group'>('total')

  const { data: totalRankings = [], isLoading: isLoadingTotal } = useQuery({
    queryKey: ['totalRankings'],
    queryFn: rankingRepository.fetchTotalRankings,
    enabled: activeTab === 'total',
  })

  const { data: idolGroups = [] } = useQuery({
    queryKey: ['idolGroups'],
    queryFn: rankingRepository.fetchIdolGroups,
  })

  const { data: groupRankings = [], isLoading: isLoadingGroup } = useQuery({
    queryKey: ['groupRankings', selectedGroupId],
    queryFn: () =>
      rankingRepository.fetchGroupRankings(selectedGroupId || undefined),
    enabled: activeTab === 'group' && selectedGroupId !== null,
  })

  const loading = activeTab === 'total' ? isLoadingTotal : isLoadingGroup

  const handleTabChange = (tab: 'total' | 'group') => {
    setActiveTab(tab)
    if (tab === 'group' && idolGroups.length > 0 && selectedGroupId === null) {
      setSelectedGroupId(idolGroups[0].idol_group_id)
    }
  }

  if (loading && totalRankings.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.tint} />
      </View>
    )
  }

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyText}>No rankings available</ThemedText>
    </View>
  )

  return (
    <View style={styles.container}>
      <RankingTabs activeTab={activeTab} onTabChange={handleTabChange} />
      {activeTab === 'group' && (
        <GroupSelector
          idolGroups={idolGroups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={setSelectedGroupId}
        />
      )}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : activeTab === 'total' ? (
        <FlatList
          data={totalRankings}
          renderItem={({ item, index }) => (
            <TotalRankingItem item={item} index={index} />
          )}
          keyExtractor={(_item, index) => `total-${index}`}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={EmptyComponent}
        />
      ) : (
        <FlatList
          data={groupRankings}
          renderItem={({ item, index }) => (
            <GroupRankingItem item={item} index={index} />
          )}
          keyExtractor={(_item, index) => `group-${index}`}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={EmptyComponent}
        />
      )}
    </View>
  )
}
