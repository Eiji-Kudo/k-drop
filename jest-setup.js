// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
  mergeItem: jest.fn(() => Promise.resolve()),
}))

// Mock Expo modules
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: { supabaseUrl: 'test-url', supabaseAnonKey: 'test-key' },
    },
  },
}))

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

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
  useLocalSearchParams: jest.fn().mockReturnValue({}),
  useNavigation: jest.fn().mockReturnValue({
    getParent: jest.fn().mockReturnValue({
      setOptions: jest.fn(),
    }),
  }),
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

// Mock required React Native components
jest.mock('react-native/src/private/animated/NativeAnimatedHelper', () => {
  return {
    __esModule: true,
    default: {
      setWaitingForIdentifier: jest.fn(),
      unsetWaitingForIdentifier: jest.fn(),
      API: {},
    },
  }
})

// Mock NativeSettingsManager
jest.mock('react-native/Libraries/Settings/NativeSettingsManager', () => {
  return {
    __esModule: true,
    default: {
      getConstants: jest.fn(() => ({})),
      getSettings: jest.fn(() => ({})),
      setValues: jest.fn(),
    },
  }
})

// Mock the React Native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native')

  // Mock components and modules
  return {
    Pressable: jest.fn(
      ({ children, onPress, testID, style, disabled, ...props }) => {
        return (
          <div {...props} testID={testID} onClick={onPress} style={style}>
            {children}
          </div>
        )
      },
    ),
    View: jest.fn(({ children, testID, ...props }) => (
      <div testID={testID} {...props}>
        {children}
      </div>
    )),
    Text: jest.fn(({ children, testID, ...props }) => (
      <div testID={testID} {...props}>
        {children}
      </div>
    )),
    ScrollView: jest.fn(({ children, testID, ...props }) => (
      <div testID={testID} {...props}>
        {children}
      </div>
    )),
    SafeAreaView: jest.fn(({ children, testID, ...props }) => (
      <div testID={testID} {...props}>
        {children}
      </div>
    )),
    Animated: {
      ...RN.Animated,
      Value: function (val) {
        this.val = val
        this.setValue = jest.fn()
        this.interpolate = jest.fn(() => ({ interpolate: jest.fn() }))
      },
      timing: jest.fn(() => ({ start: jest.fn((cb) => cb && cb()) })),
      spring: jest.fn(() => ({ start: jest.fn((cb) => cb && cb()) })),
      add: jest.fn(),
      multiply: jest.fn(),
      divide: jest.fn(),
    },
    Settings: {
      get: jest.fn(() => null),
      set: jest.fn(),
      watchKeys: jest.fn(() => ({ remove: jest.fn() })),
      clearWatch: jest.fn(),
    },
    StyleSheet: {
      create: (styles) => styles,
      flatten: jest.fn(),
    },
    NativeModules: {
      ...RN.NativeModules,
      UIManager: {
        RCTView: {
          directEventTypes: {},
        },
      },
      RNGestureHandlerModule: {
        attachGestureHandler: jest.fn(),
        createGestureHandler: jest.fn(),
        dropGestureHandler: jest.fn(),
        updateGestureHandler: jest.fn(),
        State: {},
        Directions: {},
      },
    },
  }
})

// Mock Haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}))
