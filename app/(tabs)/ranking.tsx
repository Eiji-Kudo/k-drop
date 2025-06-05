import { useState, useCallback, useRef } from 'react'
import { View, ActivityIndicator, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { Colors } from '@/constants/Colors'
import { RankingTabs } from '@/features/ranking/components/ranking-tabs'
import { RankingList } from '@/features/ranking/components/RankingList'
import { useQuery } from '@tanstack/react-query'
import { rankingRepository } from '@/repositories/rankingRepository'

const { width: screenWidth } = Dimensions.get('window')

export default function RankingScreen() {
  const [activeTab, setActiveTab] = useState<'total' | 'group'>('total')
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const scrollViewRef = useRef<ScrollView>(null)

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
    if (tab === 'total') {
      scrollViewRef.current?.scrollTo({ x: 0, animated: true })
    } else if (tab === 'group') {
      if (selectedGroupId === null && idolGroups.length > 0) {
        setSelectedGroupId(idolGroups[0].idol_group_id)
        scrollViewRef.current?.scrollTo({ x: screenWidth, animated: true })
      } else {
        const index = getCurrentTabIndex()
        scrollViewRef.current?.scrollTo({ x: index * screenWidth, animated: true })
      }
    }
  }

  const handleGroupSelect = (groupId: number) => {
    setSelectedGroupId(groupId)
    const index = idolGroups.findIndex(g => g.idol_group_id === groupId) + 1
    scrollViewRef.current?.scrollTo({ x: index * screenWidth, animated: true })
  }

  const getCurrentTabIndex = useCallback(() => {
    if (activeTab === 'total') return 0
    const groupIndex = idolGroups.findIndex(
      (group) => group.idol_group_id === selectedGroupId
    )
    return groupIndex >= 0 ? groupIndex + 1 : 1
  }, [activeTab, selectedGroupId, idolGroups])

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x
    const index = Math.round(offsetX / screenWidth)
    
    if (index === 0) {
      setActiveTab('total')
      setSelectedGroupId(null)
    } else if (index > 0 && index <= idolGroups.length) {
      setActiveTab('group')
      setSelectedGroupId(idolGroups[index - 1].idol_group_id)
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
        onGroupSelect={handleGroupSelect}
      />
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        <View style={styles.page}>
          {isLoadingTotal ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <RankingList type="total" rankings={totalRankings} />
          )}
        </View>
        {idolGroups.map((group) => (
          <View key={group.idol_group_id} style={styles.page}>
            {isLoadingGroup && selectedGroupId === group.idol_group_id ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : selectedGroupId === group.idol_group_id ? (
              <RankingList type="group" rankings={groupRankings} />
            ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width: screenWidth,
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})
