import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

export default function ResultScreen() {
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.headerContainer}>
          <ThemedText type="title">結果</ThemedText>
        </View>

        <View style={styles.resultContainer}>
          <ThemedText style={styles.resultText}>正解です！</ThemedText>
          <ThemedText style={styles.scoreText}>スコア: 100</ThemedText>
        </View>

        <View style={styles.actionContainer}>
          <PrimaryButton onPress={() => router.back()}>問題一覧に戻る</PrimaryButton>
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
  headerContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  resultContainer: {
    alignItems: 'center',
    gap: 16,
    marginTop: 24,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  safeAreaView: {
    flex: 1,
    gap: 24,
  },
  scoreText: {
    fontSize: 18,
  },
})
