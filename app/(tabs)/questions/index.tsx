import { router } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'

import { useGlobalContext } from '@/app/_context/GlobalContext'
import { useSetQuizQuestionsFromSelectedGroup } from '@/app/features/solve-problems/hooks/useGroupSelection'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { GroupButton } from './GroupButton'
import { GroupSelectionHeader } from './GroupSelectionHeader'
import { styles } from './_styles'

export default function GroupSelectionScreen() {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const { selectedQuizQuestions, setSelectedQuizQuestions } = useGlobalContext()
  const { groups } = useSetQuizQuestionsFromSelectedGroup(
    selectedQuizQuestions,
    setSelectedQuizQuestions,
  )

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
