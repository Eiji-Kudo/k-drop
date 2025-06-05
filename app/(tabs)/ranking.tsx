import { useState, useCallback, useRef } from 'react'
import { View, ActivityIndicator, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { Colors } from '@/constants/Colors'
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

  const selectedGroupId = currentIndex > 0 && idolGroups.length > 0
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

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x
    const index = Math.round(offsetX / screenWidth)
    setCurrentIndex(index)
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
