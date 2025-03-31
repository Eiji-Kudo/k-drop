import { LevelDisplay } from '@/app/components/LevelDisplay'
import { PrimaryButton } from '@/app/components/PrimaryButton'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={styles.firstTextContainer}>
          <ThemedText type="subtitle">オタ力バトルしよう！</ThemedText>
        </View>
        <LevelDisplay />
        <PrimaryButton>バトルを始める</PrimaryButton>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    padding: 16,
  },
  firstTextContainer: {
    alignItems: 'center',
    borderRadius: 10,
    padding: 16,
  },
})
