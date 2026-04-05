// Mock data
export const mockQuizId = 42
export const mockQuiz = {
  quiz_id: mockQuizId,
  prompt: 'Test Question',
  explanation: 'Test Explanation',
  idol_group_id: 1,
  quiz_difficulty_id: 1,
}
export const mockChoices = [
  {
    quiz_choice_id: 101,
    quiz_id: mockQuizId,
    choice_text: 'Option A',
    is_correct: true,
  },
  {
    quiz_choice_id: 102,
    quiz_id: mockQuizId,
    choice_text: 'Option B',
    is_correct: false,
  },
]
export type NavigationParent = {
  setOptions: (options: Record<string, unknown>) => void
}
export const mockNavigation = {
  getParent: jest
    .fn()
    .mockReturnValue({ setOptions: jest.fn() } as NavigationParent),
}
export const mockSetAnsweredQuizIds = jest.fn()
