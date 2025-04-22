import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Colors } from '@/constants/Colors'
import { useGlobalContext } from '@/context/GlobalContext'
import { Tables } from '@/database.types'
import { GroupButton } from '@/features/solve-problems/components/GroupButton'
import { GroupSelectionHeader } from '@/features/solve-problems/components/GroupSelectionHeader'
import { useSyncUnansweredQuizIds } from '@/features/solve-problems/hooks/useSyncUnansweredQuizIds'
import { supabase } from '@/utils/supabase'
import { toast } from '@backpackapp-io/react-native-toast'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

export default function GroupSelectionScreen() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const { selectedQuizIds, setSelectedQuizIds } = useGlobalContext()

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
      // error toastを出す
      toast('問題が選択されていません')
      return
    }
    toast('問題が選択されています')
    const [nextQuizId, ...remaining] = selectedQuizIds
    setSelectedQuizIds(remaining)
    router.push(`/questions/quiz/${nextQuizId}`)
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
          <PrimaryButton onPress={handleContinue} disabled={!selectedGroupId || selectedQuizIds.length === 0}>
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