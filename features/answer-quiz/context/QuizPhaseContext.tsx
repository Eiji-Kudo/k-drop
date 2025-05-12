import { Tables } from '@/database.types'
import { isChoiceCorrect } from '@/features/answer-quiz/utils/quizUtils'
import { createContext, useContext, useEffect, useState } from 'react'

type DisplayPhase = 'question' | 'result' | 'explanation'

type QuizPhaseContextType = {
  selectedChoiceId: number | null
  setSelectedChoiceId: (id: number | null) => void
  displayPhase: DisplayPhase
  setDisplayPhase: (phase: DisplayPhase) => void
  isCorrect: boolean | null
}

const QuizPhaseContext = createContext<QuizPhaseContextType | null>(null)

export const QuizPhaseProvider: React.FC<{
  children: React.ReactNode
  choices: Tables<'quiz_choices'>[]
  testDisplayPhase?: DisplayPhase
}> = ({ children, choices, testDisplayPhase }) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null)
  const [displayPhase, setDisplayPhase] = useState<DisplayPhase>('question')
  const isCorrect = isChoiceCorrect(selectedChoiceId, choices)

  useEffect(() => {
    if (testDisplayPhase) {
      setDisplayPhase(testDisplayPhase)
    }
  }, [testDisplayPhase])

  return (
    <QuizPhaseContext.Provider
      value={{
        selectedChoiceId,
        setSelectedChoiceId,
        displayPhase,
        setDisplayPhase,
        isCorrect,
      }}
    >
      {children}
    </QuizPhaseContext.Provider>
  )
}

export const useQuizPhase = () => {
  const context = useContext(QuizPhaseContext)
  if (!context) {
    throw new Error('useQuizPhase must be used within a QuizPhaseProvider')
  }
  return context
}
