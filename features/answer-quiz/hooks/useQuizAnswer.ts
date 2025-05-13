import { Tables } from '@/database.types'
import { recordQuizAnswer } from '@/features/answer-quiz/utils/quizUtils'
import { useAppUser } from '@/hooks/useAppUser'

export const useQuizAnswer = (
  quizId: number,
  choices: Tables<'quiz_choices'>[],
  quizPhase: {
    setSelectedChoiceId: (id: number | null) => void
    setDisplayPhase: (phase: 'question' | 'result' | 'explanation') => void
  },
) => {
  const { appUserId } = useAppUser()
  const { setSelectedChoiceId, setDisplayPhase } = quizPhase

  const onSelect = async (index: number) => {
    console.log('[useQuizAnswer] onSelect called with index:', index)

    if (setSelectedChoiceId == null) {
      console.log(
        '[useQuizAnswer] setSelectedChoiceId is null, returning early',
      )
      return
    }

    const choice = choices[index]
    console.log('[useQuizAnswer] Selected choice:', {
      quizChoiceId: choice.quiz_choice_id,
      isCorrect: choice.is_correct,
    })

    setSelectedChoiceId(choice.quiz_choice_id)
    console.log('[useQuizAnswer] Recording quiz answer:', {
      appUserId,
      quizId,
      choiceIndex: index,
      isCorrect: choice.is_correct,
    })

    await recordQuizAnswer(appUserId, quizId, index, choice.is_correct)
    console.log('[useQuizAnswer] Quiz answer recorded successfully')

    console.log('[useQuizAnswer] Setting display phase to result in 600ms')
    setTimeout(() => {
      setDisplayPhase('result')
      console.log('[useQuizAnswer] Display phase set to result')
    }, 600)

    console.log(
      '[useQuizAnswer] Setting display phase to explanation in 2000ms',
    )
    setTimeout(() => {
      setDisplayPhase('explanation')
      console.log('[useQuizAnswer] Display phase set to explanation')
    }, 2000)
  }

  return { onSelect }
}
