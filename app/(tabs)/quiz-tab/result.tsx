import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Colors } from '@/constants/Colors'
import { useGlobalContext } from '@/context/GlobalContext'
import { QuizResultItem } from '@/features/answer-quiz/components/QuizResultItem'
import { ResultSummary } from '@/features/answer-quiz/components/ResultSummary'
import { useQuizResults } from '@/features/answer-quiz/hooks/useQuizResults'
import { router } from 'expo-router'
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

export default function ResultScreen() {
  const { answeredQuizIds } = useGlobalContext()
  const { queryResult } = useQuizResults(answeredQuizIds)

  const {
    results: quizResults,
    totalScore,
    correctCount,
  } = queryResult.data ?? { results: [], totalScore: 0, correctCount: 0 }

  const isLoading = queryResult.isLoading

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.headerContainer}>
          <ThemedText type="title">クイズ結果</ThemedText>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : quizResults.length > 0 ? (
          <>
            <ResultSummary
              totalScore={totalScore}
              correctCount={correctCount}
              totalQuestions={quizResults.length}
            />

            <View style={styles.quizListContainer}>
              <ThemedText style={styles.sectionTitle}>
                回答したクイズ
              </ThemedText>
              {quizResults.map((result, index: number) => (
                <QuizResultItem key={index} quizResult={result} />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <ThemedText>まだクイズに回答していません</ThemedText>
          </View>
        )}

        <View style={styles.actionContainer}>
          <PrimaryButton onPress={() => router.navigate('/quiz-tab')}>
            グループ一覧に戻る
          </PrimaryButton>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  actionContainer: {
    marginBottom: 32,
    marginTop: 24,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  quizListContainer: {
    gap: 16,
    marginTop: 16,
  },
  safeAreaView: {
    flex: 1,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
})
