import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
export default function HomeScreen() {
  return (
    <>
      <ScrollView style={styles.container}>
        <ThemedView>
          <ThemedText>Hello</ThemedText>
        </ThemedView>
        
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
})
