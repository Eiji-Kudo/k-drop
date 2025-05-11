import { Tables } from '@/database.types'
import { recordQuizAnswer } from '@/features/answer-quiz/utils/quizUtils'
import { useAppUser } from '@/hooks/useAppUser'
import { useQuizPhase } from './useQuizPhase'

export const useQuizAnswer = (
  quizId: number,
  choices: Tables<'quiz_choices'>[],
) => {
  const { appUserId } = useAppUser()
  const { setSelectedChoiceId, setDisplayPhase } = useQuizPhase(
    choices,
    undefined,
  )

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
