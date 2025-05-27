import { Tables } from '@/database.types'
import { QuizVariant } from '@/features/answer-quiz/constants/quizVariant'

/**
 * Determines if the selected choice is correct
 */
export function isChoiceCorrect(
  selectedChoiceId: number | null,
  choices: Tables<'quiz_choices'>[],
): boolean | null {
  if (selectedChoiceId === null) return null

  return (
    choices.find((c) => c.quiz_choice_id === selectedChoiceId)?.is_correct ??
    false
  )
}


/**
 * Gets the variant for a quiz choice based on selection
 */
export function getChoiceVariant(
  index: number,
  choices: Tables<'quiz_choices'>[],
  selectedChoiceId: number | null,
): QuizVariant {
  if (selectedChoiceId === null) return QuizVariant.UNANSWERED

  const choice = choices[index]

  if (choice.is_correct) return QuizVariant.CORRECT
  if (choice.quiz_choice_id === selectedChoiceId) return QuizVariant.INCORRECT

  return QuizVariant.UNANSWERED
}
