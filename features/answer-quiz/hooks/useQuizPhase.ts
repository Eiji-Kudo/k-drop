import { Tables } from '@/database.types'
import { isChoiceCorrect } from '@/features/answer-quiz/utils/quizUtils'
import { useState } from 'react'

type DisplayPhase = 'question' | 'result' | 'explanation'

type QuizPhaseState = {
  selectedChoiceId: number | null
  setSelectedChoiceId: (id: number | null) => void
  displayPhase: DisplayPhase
  setDisplayPhase: (phase: DisplayPhase) => void
  isCorrect: boolean | null
}

export const useQuizPhase = (
  choices: Tables<'quiz_choices'>[],
  initialDisplayPhase: DisplayPhase = 'question',
): QuizPhaseState => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null)
  const [displayPhase, setDisplayPhase] =
    useState<DisplayPhase>(initialDisplayPhase)
  const isCorrect = isChoiceCorrect(selectedChoiceId, choices)

  return {
    selectedChoiceId,
    setSelectedChoiceId,
    displayPhase,
    setDisplayPhase,
    isCorrect,
  }
}
