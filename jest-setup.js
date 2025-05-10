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
