import { Tables } from '@/database.types'
import { QuizVariant } from '@/features/answer-quiz/constants/quizVariant'
import { supabase } from '@/utils/supabase'

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
 * Records a quiz answer in the database
 */
export async function recordQuizAnswer(
  appUserId: number | null | undefined,
  quizId: number,
  choiceIndex: number,
  isCorrect: boolean,
): Promise<void> {
  if (!appUserId) {
    console.error('Cannot record answer: app_user_id not found')
    return
  }

  try {
    await supabase.from('user_quiz_answers').insert({
      app_user_id: appUserId,
      quiz_id: quizId,
      selected_choice: choiceIndex + 1, // Keep the 1-based index for backward compatibility
      is_correct: isCorrect,
      answered_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to record quiz answer:', error)
  }
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
