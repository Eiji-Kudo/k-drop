import { router } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native'
import { useGlobalContext } from '@/app/_context/GlobalContext'
import { useSetQuizQuestionsFromSelectedGroup } from '@/features/solve-problems/hooks/useSetQuizQuestionsFromSelectedGroup'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { GroupButton } from '@/features/solve-problems/components/GroupButton'
import { GroupSelectionHeader } from '@/features/solve-problems/components/GroupSelectionHeader'
import { Colors } from '@/constants/Colors'
import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/database.types'
import { supabase } from '@/utils/supabase'

export default function GroupSelectionScreen() {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const { selectedQuizQuestions, setSelectedQuizQuestions } = useGlobalContext()
  useSetQuizQuestionsFromSelectedGroup(selectedQuizQuestions, setSelectedQuizQuestions)

  // アイドルグループを取得
  const { data: groups } = useQuery({
    queryKey: ['idol_groups'],
    queryFn: async (): Promise<Tables<'idol_group'>[]> => {
      const { data, error } = await supabase.from('idol_group').select('*')
      if (error) throw new Error(error.message)
      return data as Tables<'idol_group'>[]
    },
  })

  const handleGroupSelect = (groupId: number) => setSelectedGroup(groupId)

  const handleContinue = () => {
    if (selectedGroup) {
      router.push({
        pathname: '/questions/solve-problem',
        params: { groupId: selectedGroup.toString() },
      })
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
                isSelected={selectedGroup === group.idol_group_id}
                onPress={handleGroupSelect}
              />
            ),
          )}
        </View>

        <View style={styles.actionContainer}>
          <PrimaryButton onPress={handleContinue} disabled={!selectedGroup}>
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
