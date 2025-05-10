import { useAppUser } from '@/hooks/useAppUser'
import { supabase } from '@/utils/supabase'

/**
 * Hook for recording quiz answers to the database
 */
export const useQuizRecording = () => {
  const { appUserId } = useAppUser()

  /**
   * Records a quiz answer to the database
   * @param quizId The ID of the quiz being answered
   * @param choiceIndex The 0-based index of the chosen answer
   * @param isCorrect Whether the answer was correct
   * @returns Promise<boolean> indicating success or failure
   */
  const recordQuizAnswer = async (
    quizId: number,
    choiceIndex: number,
    isCorrect: boolean,
  ): Promise<boolean> => {
    if (!appUserId) {
      console.error('Cannot record answer: app_user_id not found')
      return false
    }

    try {
      await supabase.from('user_quiz_answers').insert({
        app_user_id: appUserId,
        quiz_id: quizId,
        selected_choice: choiceIndex + 1, // Convert to 1-based index for database consistency
        is_correct: isCorrect,
        answered_at: new Date().toISOString(),
      })
      return true
    } catch (error) {
      console.error('Failed to record quiz answer:', error)
      return false
    }
  }

  return { recordQuizAnswer }
}
