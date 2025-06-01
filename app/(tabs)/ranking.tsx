import { useState } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'
import { RankingTabs } from '@/features/ranking/components/ranking-tabs'
import { RankingList } from '@/features/ranking/components/RankingList'
import { useQuery } from '@tanstack/react-query'
import { rankingRepository } from '@/repositories/rankingRepository'

export default function RankingScreen() {
  const [activeTab, setActiveTab] = useState<'total' | 'group'>('total')
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)

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

  return (
    <View style={styles.container}>
      <RankingTabs
        activeTab={activeTab}
        selectedGroupId={selectedGroupId}
        groups={idolGroups}
        onTabChange={handleTabChange}
        onGroupSelect={setSelectedGroupId}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : activeTab === 'total' ? (
        <RankingList type="total" rankings={totalRankings} />
      ) : (
        <RankingList type="group" rankings={groupRankings} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})
