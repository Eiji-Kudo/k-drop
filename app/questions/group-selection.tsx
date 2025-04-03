import { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { SecondaryButton } from '@/components/ui/button/SecondaryButton'
import { Colors } from '@/constants/Colors'

type Group = {
  id: string
  name: string
}

export default function GroupSelectionScreen() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const groups: Group[] = [
    { id: '1', name: 'BTS' },
    { id: '2', name: 'BLACKPINK' },
    { id: '3', name: 'TWICE' },
    { id: '4', name: 'EXO' },
    { id: '5', name: 'NCT' },
  ]

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId)
  }

  const handleContinue = () => {
    if (selectedGroup) {
      // Navigate to the next screen with the selected group
      //   router.push(`/questions/difficulty?groupId=${selectedGroup}`)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.headerContainer}>
          <ThemedText type="title">ジャンルを選択</ThemedText>
          <ThemedText type="subtitle">挑戦したいジャンルを選んでください</ThemedText>
        </View>

        <View style={styles.groupsContainer}>
          {groups.map((group) => (
            <SecondaryButton
              key={group.id}
              onPress={() => handleGroupSelect(group.id)}
              style={[styles.groupButton, selectedGroup === group.id && styles.selectedGroupButton]}
            >
              <ThemedText
                style={[
                  styles.groupButtonText,
                ]}
              >
                {group.name}
              </ThemedText>
            </SecondaryButton>
          ))}
        </View>

        <View style={styles.actionContainer}>
          <PrimaryButton onPress={handleContinue} disabled={!selectedGroup}>
            次へ進む
          </PrimaryButton>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  actionContainer: {
    marginTop: 16,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  groupButton: {
    paddingVertical: 16,
    backgroundColor: Colors.secondary,
  },
  groupButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  groupsContainer: {
    gap: 12,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  safeAreaView: {
    flex: 1,
    gap: 24,
  },
  selectedGroupButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
})
