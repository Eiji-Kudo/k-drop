import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
export default function HomeScreen() {
  return (
    <>
      <ScrollView style={styles.container}>
        <SafeAreaView>
            <ThemedView>
            <ThemedText>Hello</ThemedText>
          </ThemedView>
        </SafeAreaView>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    flex: 1,
  },
})
