import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Colors } from '@/constants/Colors'
import { Tables } from '@/database.types'
import { GroupButton } from '@/features/answer-quiz/components/GroupButton'
import { GroupSelectionHeader } from '@/features/answer-quiz/components/GroupSelectionHeader'
import { useSyncUnansweredQuizIds } from '@/features/answer-quiz/hooks/useSyncUnansweredQuizIds'
import { supabase } from '@/utils/supabase'
import { showErrorToast } from '@/utils/toast'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

export default function GroupSelectionScreen() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const syncUnansweredQuizIds = useSyncUnansweredQuizIds()

  const { data: groups } = useQuery({
    queryKey: ['idol_groups'],
    queryFn: async (): Promise<Tables<'idol_groups'>[]> => {
      const { data, error } = await supabase.from('idol_groups').select('*')
      if (error) throw new Error(error.message)
      return data
    },
  })

  const handleGroupSelect = (groupId: number) => setSelectedGroupId(groupId)

  const handleContinue = async () => {
    if (!selectedGroupId) return

    try {
      const unansweredQuizIds =
        await syncUnansweredQuizIds.mutateAsync(selectedGroupId)

      if (unansweredQuizIds.length === 0) {
        showErrorToast('問題がありません')
        return
      }

      const nextQuizId = unansweredQuizIds[0]
      if (nextQuizId) {
        router.push(`/quiz-tab/quiz/${nextQuizId.toString()}`)
      } else {
        router.push('/quiz-tab/result')
      }
    } catch {
      showErrorToast('問題の取得に失敗しました')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}>
        <GroupSelectionHeader />

        <View style={styles.groupsContainer}>
          {groups?.map((group) =>
            group.idol_group_name === '所属なし' ? null : (
              <GroupButton
                key={group.idol_group_id}
                group={group}
                isSelected={selectedGroupId === group.idol_group_id}
                onPress={handleGroupSelect}
              />
            ),
          )}
        </View>

        <View style={styles.actionContainer}>
          <PrimaryButton
            onPress={handleContinue}
            disabled={!selectedGroupId || syncUnansweredQuizIds.isPending}
          >
            {syncUnansweredQuizIds.isPending ? '読み込み中...' : '問題へ進む'}
          </PrimaryButton>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  actionContainer: { paddingTop: 16 },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  groupsContainer: {
    gap: 12,
  },
  safeAreaView: {
    flex: 1,
    gap: 24,
  },
})
