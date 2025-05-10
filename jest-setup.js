// Mock Supabase
jest.mock('@/utils/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      then: jest
        .fn()
        .mockImplementation((callback) => callback({ data: [], error: null })),
    }),
  },
}))

// Mock setTimeout and setImmediate
jest.useFakeTimers()
global.setImmediate = jest.fn((cb) => setTimeout(cb, 0))

// Mock ResultModal
jest.mock('@/features/answer-quiz/components/result-modal', () => ({
  ResultModal: jest.fn().mockImplementation(({ visible, isCorrect }) => null),
}))

// Mock ThemedText
jest.mock('@/components/ThemedText', () => ({
  ThemedText: jest.fn((props) => props.children),
}))
