import { useState, useCallback, useRef } from 'react'
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { Colors } from '@/constants/Colors'
import { LoadingIndicator } from '@/components/ui/LoadingIndicator'
import { RankingTabs } from '@/features/ranking/components/ranking-tabs'
import { RankingList } from '@/features/ranking/components/RankingList'
import { useQuery } from '@tanstack/react-query'
import { rankingRepository } from '@/repositories/rankingRepository'

const { width: screenWidth } = Dimensions.get('window')

export default function RankingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)

  const { data: totalRankings = [], isLoading: isLoadingTotal } = useQuery({
    queryKey: ['totalRankings'],
    queryFn: rankingRepository.fetchTotalRankings,
    enabled: currentIndex === 0,
  })

  const { data: idolGroups = [] } = useQuery({
    queryKey: ['idolGroups'],
    queryFn: rankingRepository.fetchIdolGroups,
  })

  const selectedGroupId =
    currentIndex > 0 && idolGroups.length > 0
      ? idolGroups[currentIndex - 1]?.idol_group_id
      : null

  const { data: groupRankings = [], isLoading: isLoadingGroup } = useQuery({
    queryKey: ['groupRankings', selectedGroupId],
    queryFn: () =>
      rankingRepository.fetchGroupRankings(selectedGroupId || undefined),
    enabled: currentIndex > 0 && selectedGroupId !== null,
  })

  const loading = currentIndex === 0 ? isLoadingTotal : isLoadingGroup

  const handleTabPress = useCallback((index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * screenWidth, animated: true })
  }, [])

  const handleScroll = (event: {
    nativeEvent: { contentOffset: { x: number } }
  }) => {
    const offsetX = event.nativeEvent.contentOffset.x
    const index = Math.round(offsetX / screenWidth)
    setCurrentIndex(index)
  }

  if (loading) {
    return <LoadingIndicator />
  }

  return (
    <View style={styles.container}>
      <RankingTabs
        currentIndex={currentIndex}
        groups={idolGroups}
        onTabPress={handleTabPress}
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
          <RankingList type="total" rankings={totalRankings} />
        </View>
        {idolGroups.map((group) => (
          <View key={group.idol_group_id} style={styles.page}>
            <RankingList type="group" rankings={groupRankings} />
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
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  page: {
    flex: 1,
    width: screenWidth,
  },
  scrollView: {
    flex: 1,
  },
})
