import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { BentoGrid } from '../BentoGrid'

jest.mock('moti', () => ({
  MotiView: ({ children }: { children: ReactNode }) => {
    const { View } = require('react-native')
    return <View>{children}</View>
  },
}))

jest.mock('moti/interactions', () => ({
  MotiPressable: ({ children, ...props }: { children: ReactNode }) => {
    const { Pressable } = require('react-native')
    return <Pressable {...props}>{children}</Pressable>
  },
}))

jest.mock('../BentoIcons', () => ({
  CreateIcon: () => null,
  ProfileIcon: () => null,
  QuizIcon: () => null,
  RankingIcon: () => null,
}))

jest.mock('expo-router', () => ({
  router: { navigate: jest.fn() },
}))

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'Medium' },
}))

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}))

describe('BentoGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('navigates from the available home cards', async () => {
    const { getByText } = render(<BentoGrid />)

    fireEvent.press(getByText('問題を解く'))
    fireEvent.press(getByText('ランキング'))
    fireEvent.press(getByText('プロフィール'))

    await waitFor(() => {
      expect(router.navigate).toHaveBeenNthCalledWith(1, '/quiz-tab')
      expect(router.navigate).toHaveBeenNthCalledWith(2, '/ranking')
      expect(router.navigate).toHaveBeenNthCalledWith(3, '/profile')
    })

    expect(Haptics.impactAsync).toHaveBeenCalledTimes(3)
  })

  it('renders the redesigned section copy', () => {
    const { getByText } = render(<BentoGrid />)

    expect(getByText('今日のメニュー')).toBeTruthy()
    expect(
      getByText('まずは「問題を解く」から入ると、流れがつかみやすい。'),
    ).toBeTruthy()
  })
})
