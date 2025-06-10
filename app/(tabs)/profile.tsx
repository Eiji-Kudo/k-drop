import { useState, useCallback } from 'react'
import { ScrollView, View, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ProfileHeader } from '@/features/profile/components/ProfileHeader'
import { ProfileStats } from '@/features/profile/components/ProfileStats'
import { ProfileBadges } from '@/features/profile/components/profile-badges'
import { ProfileGroups } from '@/features/profile/components/profile-groups'
import { ProfileProgress } from '@/features/profile/components/profile-progress'
import { useProfileData } from '@/features/profile/hooks/useProfileData'
import { useUserGroups } from '@/features/profile/hooks/useUserGroups'
import { useDailyScores } from '@/features/profile/hooks/useDailyScores'
import { ThemedText } from '@/components/ThemedText'
import { styles } from './profile.styles'
import { ProfileLoadingStates } from '@/features/profile/components/ProfileLoadingStates'

export default function ProfileScreen() {
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useProfileData()
  const {
    data: userGroups,
    isLoading: groupsLoading,
    refetch: refetchGroups,
  } = useUserGroups()
  const {
    data: scoreData,
    isLoading: scoresLoading,
    refetch: refetchScores,
  } = useDailyScores()
  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([refetchProfile(), refetchGroups(), refetchScores()])
    setRefreshing(false)
  }, [refetchProfile, refetchGroups, refetchScores])

  const loadingState = ProfileLoadingStates({
    isLoading: profileLoading || groupsLoading || scoresLoading,
    hasError: !!profileError,
    hasData: !!(profileData && userGroups && scoreData),
  })
  if (loadingState) return loadingState

  if (!profileData || !userGroups || !scoreData) return null

  const groupLayerIds = userGroups.map((g) => ({
    groupId: g.groupId,
    layerId: g.layerId || 1,
  }))
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ProfileHeader
          userName={profileData.userName}
          nickname={profileData.nickname}
          avatarUrl={profileData.avatarUrl}
          onSettingsPress={() => console.log('Settings pressed')}
        />
        <ProfileStats
          totalOtakuPower={profileData.totalOtakuScore}
          fanSince={profileData.fanSince}
          layerName={profileData.totalOtakuLayerName}
        />
        {profileData.description && (
          <View style={styles.descriptionContainer}>
            <ThemedText type="default" style={styles.description}>
              {profileData.description}
            </ThemedText>
          </View>
        )}
        <ProfileBadges
          totalLayerId={profileData.totalOtakuLayerId}
          groupLayerIds={groupLayerIds}
        />
        <ProfileGroups groups={userGroups} />
        <ProfileProgress
          dailyScores={scoreData.dailyScores}
          percentageIncrease={scoreData.percentageIncrease}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
