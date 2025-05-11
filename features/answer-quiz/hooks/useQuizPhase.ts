import { Tables } from '@/database.types'
import { isChoiceCorrect } from '@/features/answer-quiz/utils/quizUtils'
import { useEffect, useState } from 'react'

type DisplayPhase = 'question' | 'result' | 'explanation'

export const useQuizPhase = (
  choices: Tables<'quiz_choices'>[],
  testDisplayPhase?: DisplayPhase,
) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null)
  const [displayPhase, setDisplayPhase] = useState<DisplayPhase>('question')
  const isCorrect = isChoiceCorrect(selectedChoiceId, choices)

  useEffect(() => {
    if (testDisplayPhase) {
      setDisplayPhase(testDisplayPhase)
    }
  }, [testDisplayPhase])

  return {
    selectedChoiceId,
    setSelectedChoiceId,
    displayPhase,
    setDisplayPhase,
    isCorrect,
  }
}
