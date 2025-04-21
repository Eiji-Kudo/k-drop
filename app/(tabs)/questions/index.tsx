import { Tables } from '@/database.types'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

import { useGlobalContext } from '@/app/_context/GlobalContext'
import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { SecondaryButton } from '@/components/ui/button/SecondaryButton'
import { Colors } from '@/constants/Colors'
import { supabase } from '@/utils/supabase'
import { User } from '@supabase/supabase-js'
import { router } from 'expo-router'

export default function GroupSelectionScreen() {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const { selectedQuizQuestions, setSelectedQuizQuestions } = useGlobalContext()

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      const { data } = await supabase.auth.getUser()
      return data.user
    },
  })

  const { data: userQuizAnswer } = useQuery({
    queryKey: ['user_quiz_answer', user?.id],
    queryFn: async (): Promise<Tables<'user_quiz_answer'>[]> => {
      if (!user) return []
      const { data, error } = await supabase
        .from('user_quiz_answer')
        .select('*')
        .eq('user_id', user.id)
      if (error) throw new Error(error.message)
      return data as Tables<'user_quiz_answer'>[]
    },
    enabled: !!user,
  })

  const { data: quizQuestions } = useQuery({
    queryKey: ['quiz_question', selectedGroup],
    queryFn: async (): Promise<Tables<'quiz_question'>[]> => {
      if (!selectedGroup) return []
      const { data, error } = await supabase
        .from('quiz_question')
        .select('*')
        .eq('idol_group_id', selectedGroup)
      if (error) throw new Error(error.message)
      return data as Tables<'quiz_question'>[]
    },
    enabled: !!selectedGroup,
  })

  const solvedQuizIds = useMemo(
    () => userQuizAnswer?.map((a) => a.quiz_question_id) ?? [],
    [userQuizAnswer],
  )

  const selectedGroupQuizQuestions = useMemo(
    () =>
      quizQuestions?.map((q) => q.quiz_question_id).filter((id) => !solvedQuizIds.includes(id)) ??
      [],
    [quizQuestions, solvedQuizIds],
  )

  useEffect(() => {
    const filteredQuizQuestions = selectedQuizQuestions.filter((id) => !solvedQuizIds.includes(id))
    setSelectedQuizQuestions(filteredQuizQuestions)
  }, [selectedGroupQuizQuestions, setSelectedQuizQuestions, selectedQuizQuestions, solvedQuizIds])

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
        <View style={styles.headerContainer}>
          <ThemedText type="title">ジャンルを選択</ThemedText>
          <ThemedText type="subtitle">挑戦したいジャンルを選んでください</ThemedText>
        </View>

        <View style={styles.groupsContainer}>
          {groups?.map((group) =>
            group.idol_group_name === '所属なし' ? null : (
              <SecondaryButton
                key={group.idol_group_id}
                onPress={() => handleGroupSelect(group.idol_group_id)}
                style={[
                  styles.groupButton,
                  selectedGroup === group.idol_group_id && styles.selectedGroupButton,
                ]}
              >
                <ThemedText key={`text-${group.idol_group_id}`} style={styles.groupButtonText}>
                  {group.idol_group_name}
                </ThemedText>
              </SecondaryButton>
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
  container: { backgroundColor: Colors.background, flex: 1, paddingHorizontal: 16, paddingTop: 24 },
  groupButton: { backgroundColor: Colors.secondary, paddingVertical: 16 },
  groupButtonText: { fontSize: 16, textAlign: 'center' },
  groupsContainer: { gap: 12 },
  headerContainer: { alignItems: 'center', gap: 8 },
  safeAreaView: { flex: 1, gap: 24 },
  selectedGroupButton: { borderColor: Colors.primary, borderWidth: 2 },
})
