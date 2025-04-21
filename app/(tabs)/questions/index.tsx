import { router } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native'
import { useGlobalContext } from '@/app/_context/GlobalContext'
import { useSetQuizQuestionsFromSelectedGroup } from '@/features/solve-problems/hooks/useGroupSelection'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { GroupButton } from '@/features/solve-problems/components/GroupButton'
import { GroupSelectionHeader } from '@/features/solve-problems/components/GroupSelectionHeader'
import { Colors } from '@/constants/Colors'

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
