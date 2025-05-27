import {
  useQuizChoices,
  useQuiz,
} from '@/features/answer-quiz/hooks/useQuizQuery'
import { recordQuizAnswer } from '@/features/answer-quiz/utils/quizUtils'
import { useUpdateOtakuPower } from '@/features/answer-quiz/hooks/useUpdateOtakuPower'
import { useAppUser } from '@/hooks/useAppUser'

export const useQuizOnSelect = (
  quizId: number,
  setSelectedChoiceId: (id: number | null) => void,
  setDisplayPhase: (phase: 'question' | 'result' | 'explanation') => void,
) => {
  const { appUserId } = useAppUser()
  const { data: choices = [] } = useQuizChoices(quizId)
  const { data: quizData } = useQuiz(quizId)
  const { updateOtakuPower } = useUpdateOtakuPower()

  const onSelect = async (index: number) => {
    if (setSelectedChoiceId == null) return
    const choice = choices[index]
    setSelectedChoiceId(choice.quiz_choice_id)
    await recordQuizAnswer(appUserId, quizId, index, choice.is_correct)

    if (appUserId && quizData) {
      await updateOtakuPower({
        userId: appUserId,
        quizId: quizData.quiz_id,
        groupId: quizData.idol_group_id,
        difficultyId: quizData.quiz_difficulty_id,
        isCorrect: choice.is_correct,
      })
    }

    setTimeout(() => setDisplayPhase('result'), 600)
    setTimeout(() => setDisplayPhase('explanation'), 2000)
  }

  return { onSelect }
}
