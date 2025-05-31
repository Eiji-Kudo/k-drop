import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { QuizResult } from '@/features/answer-quiz/hooks/useQuizResults'
import { StyleSheet, View } from 'react-native'

export function QuizResultItem({ quizResult }: { quizResult: QuizResult }) {
  const { quiz, choices, userAnswer } = quizResult
  const selectedChoice = choices.find(
    (choice) => choice.quiz_choice_id === userAnswer.selected_choice,
  )
  const correctChoice = choices.find((choice) => choice.is_correct)

  return (
    <View style={styles.quizResultItem}>
      <ThemedText style={styles.quizPrompt}>{quiz.prompt}</ThemedText>
      <View style={styles.answerContainer}>
        <ThemedText
          style={[
            styles.answerText,
            userAnswer.is_correct ? styles.correctText : styles.incorrectText,
          ]}
        >
          {userAnswer.is_correct ? '正解' : '不正解'}
        </ThemedText>
        <ThemedText style={styles.choiceText}>
          あなたの回答: {selectedChoice?.choice_text}
        </ThemedText>
        {!userAnswer.is_correct && correctChoice && (
          <ThemedText style={[styles.choiceText, styles.correctText]}>
            正解: {correctChoice.choice_text}
          </ThemedText>
        )}
      </View>
      <View style={styles.explanationContainer}>
        <ThemedText style={styles.explanationText}>
          {quiz.explanation}
        </ThemedText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  answerContainer: {
    gap: 4,
    paddingVertical: 8,
  },
  answerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  choiceText: {
    fontSize: 14,
  },
  correctText: {
    color: Colors.success,
  },
  explanationContainer: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 8,
  },
  explanationText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  incorrectText: {
    color: Colors.error,
  },
  quizPrompt: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizResultItem: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    elevation: 1,
    gap: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
})
