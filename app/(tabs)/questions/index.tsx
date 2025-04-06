import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { SecondaryButton } from '@/components/ui/button/SecondaryButton'
import { Colors } from '@/constants/Colors'
import { supabase } from '@/utils/supabase'
import { router } from 'expo-router'

export default function GroupSelectionScreen() {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)

  const { data: groups, isLoading, error } = useQuery({
    queryKey: ['idol_groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('idol_group')
        .select('*')
      
      if (error) {
        throw new Error(error.message)
      }
      return data
    }
  })

  const handleGroupSelect = (groupId: number) => {
    setSelectedGroup(groupId)
  }

  const handleContinue = () => {
    if (selectedGroup) {
      router.push({
        pathname: '/questions/solve-problem',
        params: { 
          groupId: selectedGroup.toString() 
        },
      })
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
          {groups?.map((group) => (
            <SecondaryButton
              key={group.idol_group_id}
              onPress={() => handleGroupSelect(group.idol_group_id)}
              style={[styles.groupButton, selectedGroup === group.idol_group_id && styles.selectedGroupButton]}
            >
              <ThemedText key={`text-${group.idol_group_id}`} style={styles.groupButtonText}>{group.idol_group_name}</ThemedText>
            </SecondaryButton>
          ))}
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
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
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
    borderColor: Colors.primary,
    borderWidth: 2,
  },
})
