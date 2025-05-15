import { useQuizChoices } from '@/features/answer-quiz/hooks/useQuizQuery'
import { recordQuizAnswer } from '@/features/answer-quiz/utils/quizUtils'
import { useAppUser } from '@/hooks/useAppUser'

export const useQuizOnSelect = (
  quizId: number,
  setSelectedChoiceId: (id: number | null) => void,
  setDisplayPhase: (phase: 'question' | 'result' | 'explanation') => void,
) => {
  const { appUserId } = useAppUser()
  const { data: choices = [] } = useQuizChoices(quizId)

  const onSelect = async (index: number) => {
    if (setSelectedChoiceId == null) return
    const choice = choices[index]
    setSelectedChoiceId(choice.quiz_choice_id)
    await recordQuizAnswer(appUserId, quizId, index, choice.is_correct)

    setTimeout(() => setDisplayPhase('result'), 600)
    setTimeout(() => setDisplayPhase('explanation'), 2000)
  }

  return { onSelect }
}
