jest.mock('moti/interactions', () => ({
  MotiPressable: ({ children, onPress, style, testID }) => {
    const { TouchableOpacity } = require('react-native')
    return require('react').createElement(
      TouchableOpacity,
      { onPress, style, testID },
      children,
    )
  },
}))

jest.mock('moti', () => ({
  MotiView: ({ children, style }) => {
    const { View } = require('react-native')
    return require('react').createElement(View, { style }, children)
  },
}))

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, style }) => {
    const { View } = require('react-native')
    return require('react').createElement(View, { style }, children)
  },
}))

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}))

jest.mock('@/utils/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
          },
        },
        error: null,
      }),
    },
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
