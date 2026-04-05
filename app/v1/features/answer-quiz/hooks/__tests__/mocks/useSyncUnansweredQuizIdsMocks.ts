import { supabase } from '@/utils/supabase'

export const setupMocks = (userAnswers: any[], quizzes: any[]) => {
  ;(supabase.from as jest.Mock).mockImplementation((table: string) => ({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({
        data: table === 'user_quiz_answers' ? userAnswers : quizzes,
        error: null,
      }),
    }),
  }))
}

export const createQuizzes = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    quiz_id: i + 1,
    idol_group_id: 1,
    prompt: `Quiz ${i + 1}`,
    correct_answer: `Answer ${i + 1}`,
    created_at: new Date().toISOString(),
  }))
