import { Tables } from '@/database.types'

const quizzesMock = [
  {
    quiz_id: 1,
    prompt: 'Test Quiz 1',
    explanation: 'Explanation 1',
    idol_group_id: 1,
    quiz_difficulty_id: 1,
  },
  {
    quiz_id: 2,
    prompt: 'Test Quiz 2',
    explanation: 'Explanation 2',
    idol_group_id: 1,
    quiz_difficulty_id: 1,
  },
] as Tables<'quizzes'>[]

const choicesMock = [
  {
    quiz_choice_id: 101,
    quiz_id: 1,
    choice_text: 'Correct Answer 1',
    is_correct: true,
  },
  {
    quiz_choice_id: 102,
    quiz_id: 1,
    choice_text: 'Wrong Answer 1',
    is_correct: false,
  },
  {
    quiz_choice_id: 201,
    quiz_id: 2,
    choice_text: 'Correct Answer 2',
    is_correct: true,
  },
  {
    quiz_choice_id: 202,
    quiz_id: 2,
    choice_text: 'Wrong Answer 2',
    is_correct: false,
  },
] as Tables<'quiz_choices'>[]

const userAnswersMock = [
  {
    user_quiz_answer_id: 1001,
    quiz_id: 1,
    selected_choice: 101,
    is_correct: true,
    answered_at: new Date().toISOString(),
    app_user_id: 1,
  },
  {
    user_quiz_answer_id: 1002,
    quiz_id: 2,
    selected_choice: 202,
    is_correct: false,
    answered_at: new Date().toISOString(),
    app_user_id: 1,
  },
] as Tables<'user_quiz_answers'>[]

export const setupSupabaseMocks = () => {
  const mockSelect = jest.fn().mockReturnThis()
  const mockIn = jest.fn().mockReturnThis()
  const mockOrder = jest.fn().mockReturnThis()

  const getMockData = (tableName: string) => {
    if (tableName === 'user_quiz_answers') return userAnswersMock
    if (tableName === 'quizzes') return quizzesMock
    if (tableName === 'quiz_choices') return choicesMock
    return []
  }

  const mockFrom = jest.fn().mockImplementation((tableName) => {
    return {
      select: mockSelect,
      in: mockIn,
      order: mockOrder,
      then: jest.fn().mockImplementation((callback) => {
        return Promise.resolve(
          callback({
            data: getMockData(tableName),
            error: null,
          }),
        )
      }),
    }
  })

  return {
    mockFrom,
    mockSelect,
    mockIn,
    mockOrder,
  }
}
