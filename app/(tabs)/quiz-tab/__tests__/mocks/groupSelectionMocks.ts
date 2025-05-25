import { Tables } from '@/database.types'

export type MockData = {
  idol_groups: Tables<'idol_groups'>[]
  quizzes: Tables<'quizzes'>[]
  user_quiz_answers: Tables<'user_quiz_answers'>[]
}

export const mockSupabaseData: MockData = {
  idol_groups: [
    {
      idol_group_id: 1,
      idol_group_name: 'TWICE',
      group_category_id: 1,
      thumbnail_image: null,
    },
    {
      idol_group_id: 2,
      idol_group_name: 'BTS',
      group_category_id: 1,
      thumbnail_image: null,
    },
    {
      idol_group_id: 3,
      idol_group_name: '所属なし',
      group_category_id: 1,
      thumbnail_image: null,
    },
  ],
  quizzes: [
    {
      quiz_id: 1,
      idol_group_id: 1,
      prompt: 'Test question 1',
      quiz_difficulty_id: 1,
      explanation: 'Test explanation',
    },
    {
      quiz_id: 2,
      idol_group_id: 1,
      prompt: 'Test question 2',
      quiz_difficulty_id: 1,
      explanation: 'Test explanation',
    },
    {
      quiz_id: 3,
      idol_group_id: 1,
      prompt: 'Test question 3',
      quiz_difficulty_id: 1,
      explanation: 'Test explanation',
    },
    {
      quiz_id: 4,
      idol_group_id: 1,
      prompt: 'Test question 4',
      quiz_difficulty_id: 1,
      explanation: 'Test explanation',
    },
    {
      quiz_id: 5,
      idol_group_id: 1,
      prompt: 'Test question 5',
      quiz_difficulty_id: 1,
      explanation: 'Test explanation',
    },
  ],
  user_quiz_answers: [],
}
