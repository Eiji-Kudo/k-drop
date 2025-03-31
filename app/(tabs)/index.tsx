import { LevelDisplay } from '@/components/LevelDisplay'
import { PrimaryButton } from '@/components/PrimaryButton'
import { SecondaryButton } from '@/components/SecondaryButton'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.firstTextContainer}>
          <ThemedText type="subtitle">オタ力バトルしよう！</ThemedText>
        </View>
        <LevelDisplay />
        <PrimaryButton>問題を解く</PrimaryButton>
        <SecondaryButton>問題を作成する</SecondaryButton>
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
  firstTextContainer: {
    alignItems: 'center',
    borderRadius: 10,
  },
  safeAreaView: {
    flex: 1,
    gap: 16,
  },
})
