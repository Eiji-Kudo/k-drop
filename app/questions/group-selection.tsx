import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native'
import { useState } from 'react'
import { router } from 'expo-router'

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
  
  // Mock data for groups
  const groups: Group[] = [
    { id: '1', name: 'アニメ' },
    { id: '2', name: 'マンガ' },
    { id: '3', name: 'ゲーム' },
    { id: '4', name: '映画' },
    { id: '5', name: '音楽' },
  ]

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId)
  }

  const handleContinue = () => {
    if (selectedGroup) {
      // Navigate to the next screen with the selected group
      router.push(`/questions/difficulty?groupId=${selectedGroup}`)
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
              style={[
                styles.groupButton,
                selectedGroup === group.id && styles.selectedGroupButton
              ]}
            >
              <ThemedText 
                style={[
                  styles.groupButtonText,
                  selectedGroup === group.id && styles.selectedGroupButtonText
                ]}
              >
                {group.name}
              </ThemedText>
            </SecondaryButton>
          ))}
        </View>
        
        <View style={styles.actionContainer}>
          <PrimaryButton 
            onPress={handleContinue}
            disabled={!selectedGroup}
          >
            次へ進む
          </PrimaryButton>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  safeAreaView: {
    flex: 1,
    gap: 24
  },
  headerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  groupsContainer: {
    gap: 12,
  },
  groupButton: {
    paddingVertical: 16,
  },
  selectedGroupButton: {
    backgroundColor: Colors.tint,
  },
  groupButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedGroupButtonText: {
    color: Colors.white,
  },
  actionContainer: {
    marginTop: 16,
  },
})
