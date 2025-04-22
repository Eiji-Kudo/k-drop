import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { Colors } from '@/constants/Colors'
import { ResultModal } from '@/features/answer-quiz/components/result-modal'
import { useNextQuiz } from '@/features/answer-quiz/hooks/useNextQuiz'
import { useQuizQuery } from '@/features/answer-quiz/hooks/useQuizQuery'
import { useState } from 'react'
import { QuizChoice } from './QuizChoice'

type ChoiceVariant = 'default' | 'correct' | 'wrong'

const QuizHeader = () => (
  <View style={styles.headerContainer}>
    <ThemedText type="title">問題を解く</ThemedText>
    <ThemedText type="subtitle">以下の問題に解答してください</ThemedText>
  </View>
)

type QuestionPromptProps = {
  prompt: string
}

const QuestionPrompt = ({ prompt }: QuestionPromptProps) => (
  <View>
    <ThemedText style={styles.questionText}>{prompt}</ThemedText>
  </View>
)

type ChoicesSectionProps = {
  choices: string[]
  getVariant: (index: number) => ChoiceVariant
  onChoicePress: (index: number) => void
  disabled: boolean
}

const ChoicesSection = ({ choices, getVariant, onChoicePress, disabled }: ChoicesSectionProps) => (
  <View style={styles.choicesContainer}>
    {choices.map((choice, index) => (
      <QuizChoice
        key={index}
        index={index}
        label={choice}
        variant={getVariant(index)}
        disabled={disabled}
        onPress={() => onChoicePress(index)}
      />
    ))}
  </View>
)

type ExplanationSectionProps = {
  explanation: string
  onNextPress: () => void
}

const ExplanationSection = ({ explanation, onNextPress }: ExplanationSectionProps) => (
  <>
    <View>
      <ThemedText style={styles.explanationText}>{explanation}</ThemedText>
    </View>
    <View>
      <PrimaryButton onPress={onNextPress}>次へ</PrimaryButton>
    </View>
  </>
)

export default function QuizScreen() {
  const { getNextQuiz } = useNextQuiz()
  const { quizId } = useLocalSearchParams()

  if (typeof quizId !== 'string') throw new Error('Invalid quizId')

  const { data: quiz } = useQuizQuery(quizId)

  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [buttonsLocked, setButtonsLocked] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [mark, setMark] = useState<{ symbol: '◎' | '×'; color: string } | null>(null)

  const navigateToNextQuestionOrResult = () => {
    const next = getNextQuiz()
    router.push(next ? `/quiz-tab/quiz/${next}` : '/quiz-tab/result')
    setMark(null)
  }

  const handleChoiceSelection = (choiceIndex: number) => {
    if (buttonsLocked || !quiz) return
    
    const selectedChoiceNumber = choiceIndex + 1
    setSelectedChoice(selectedChoiceNumber)
    setButtonsLocked(true)
    
    const isCorrect = quiz.correct_choice === selectedChoiceNumber
    setMark({
      symbol: isCorrect ? '◎' : '×',
      color: isCorrect ? '#68c1f1' : '#f56f6f',
    })
    
    setTimeout(() => setShowExplanation(true), 600)
    setTimeout(() => setMark(null), 2000)
  }

  const getChoiceVariant = (choiceIndex: number): ChoiceVariant => {
    if (!buttonsLocked || !quiz) return 'default'
    
    const choiceNumber = choiceIndex + 1
    if (quiz.correct_choice === choiceNumber) return 'correct'
    if (selectedChoice === choiceNumber) return 'wrong'
    return 'default'
  }

  if (!quiz) return null

  const choices = [quiz.choice1, quiz.choice2, quiz.choice3, quiz.choice4]

  return (
    <>
      <ScrollView style={styles.container}>
        <SafeAreaView style={styles.safeAreaView}>
          <QuizHeader />
          <QuestionPrompt prompt={quiz.prompt} />
          <ChoicesSection 
            choices={choices}
            getVariant={getChoiceVariant}
            onChoicePress={handleChoiceSelection}
            disabled={buttonsLocked}
          />

          {showExplanation && (
            <ExplanationSection 
              explanation={quiz.explanation} 
              onNextPress={navigateToNextQuestionOrResult} 
            />
          )}
        </SafeAreaView>
      </ScrollView>

      <ResultModal visible={!!mark} mark={mark} />
    </>
  )
}

const styles = StyleSheet.create({
  choicesContainer: { gap: 16 },
  container: { backgroundColor: Colors.background, flex: 1, paddingHorizontal: 16, paddingTop: 24 },
  explanationText: { fontSize: 14, lineHeight: 20 },
  headerContainer: { alignItems: 'center', gap: 8 },
  questionText: { fontSize: 18, lineHeight: 24 },
  safeAreaView: { flex: 1, gap: 32 },
})
