import { Tables } from '@/database.types'
import { recordQuizAnswer } from '@/features/answer-quiz/utils/quizUtils'
import { useAppUser } from '@/hooks/useAppUser'

export const useQuizAnswer = (
  quizId: number,
  choices: Tables<'quiz_choices'>[],
  setSelectedChoiceId: (id: number | null) => void,
  setDisplayPhase: (phase: 'question' | 'result' | 'explanation') => void,
) => {
  const { appUserId } = useAppUser()

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
