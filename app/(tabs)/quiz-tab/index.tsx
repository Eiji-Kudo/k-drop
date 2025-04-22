import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Colors } from '@/constants/Colors'
import { useGlobalContext } from '@/context/GlobalContext'
import { Tables } from '@/database.types'
import { GroupButton } from '@/features/answer-quiz/components/GroupButton'
import { GroupSelectionHeader } from '@/features/answer-quiz/components/GroupSelectionHeader'
import { useNextQuiz } from '@/features/answer-quiz/hooks/useNextQuiz'
import { useSyncUnansweredQuizIds } from '@/features/answer-quiz/hooks/useSyncUnansweredQuizIds'
import { supabase } from '@/utils/supabase'
import { showErrorToast } from '@/utils/toast'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

export default function GroupSelectionScreen() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const { selectedQuizIds } = useGlobalContext()
  const { getNextQuiz, hasQuizzes } = useNextQuiz()

  useSyncUnansweredQuizIds(selectedGroupId)

  const { data: groups } = useQuery({
    queryKey: ['idol_groups'],
    queryFn: async (): Promise<Tables<'idol_group'>[]> => {
      const { data, error } = await supabase.from('idol_group').select('*')
      if (error) throw new Error(error.message)
      return data as Tables<'idol_group'>[]
    },
  })

  const handleGroupSelect = (groupId: number) => setSelectedGroupId(groupId)

  const handleContinue = () => {
    if (selectedQuizIds.length === 0) {
      showErrorToast('問題が選択されていません')
      return
    }
    const nextQuizId = getNextQuiz()
    if (nextQuizId) {
      router.push(`/quiz-tab/quiz/${nextQuizId}`)
    } else {
      router.push('/quiz-tab/result')
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
          <PrimaryButton onPress={handleContinue} disabled={!selectedGroupId || !hasQuizzes}>
            問題へ進む
          </PrimaryButton>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  actionContainer: { marginTop: 16 },
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
