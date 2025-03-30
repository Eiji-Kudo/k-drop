import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={styles.firstTextContainer}>
          <ThemedText type="subtitle">オタ力バトルしよう！</ThemedText>
        </View>
        <View style={styles.levelContainer}>
          <ThemedText type="subtitle">Level</ThemedText>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    flex: 1,
    padding: 16,
  },
  firstTextContainer: {
    alignItems: 'center',
    borderRadius: 10,
    padding: 16,
  },
  levelContainer: {
    alignItems: 'center',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
})
