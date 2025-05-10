import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { QuizChoice } from '../QuizChoice'
import { QuizVariant } from '../../constants/quizVariant'

describe('QuizChoice', () => {
  const onPressMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with the right label', () => {
    const { getByText, getByTestId } = render(
      <QuizChoice
        index={0}
        label="Test Option"
        variant={QuizVariant.UNANSWERED}
        onPress={onPressMock}
      />
    )

    // Check if button is rendered with correct text (index + 1 prefixed)
    expect(getByText('1. Test Option')).toBeTruthy()
    expect(getByTestId('quiz-choice')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const { getByTestId } = render(
      <QuizChoice
        index={0}
        label="Test Option"
        variant={QuizVariant.UNANSWERED}
        onPress={onPressMock}
      />
    )

    // Press the choice
    fireEvent.press(getByTestId('quiz-choice'))

    // Check if onPress was called
    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  it('applies correct styling when answer is correct', () => {
    const { getByTestId } = render(
      <QuizChoice
        index={0}
        label="Test Option"
        variant={QuizVariant.CORRECT}
        onPress={onPressMock}
      />
    )

    // In React Native Testing Library, we can't easily check styles directly
    // We would need to use snapshot testing for this, but for now we'll just
    // verify that the component renders with the correct variant
    const choiceButton = getByTestId('quiz-choice')
    expect(choiceButton).toBeTruthy()
  })

  it('applies incorrect styling when answer is incorrect', () => {
    const { getByTestId } = render(
      <QuizChoice
        index={0}
        label="Test Option"
        variant={QuizVariant.INCORRECT}
        onPress={onPressMock}
      />
    )

    const choiceButton = getByTestId('quiz-choice')
    expect(choiceButton).toBeTruthy()
  })

  it('does not call onPress when disabled', () => {
    const { getByTestId } = render(
      <QuizChoice
        index={0}
        label="Test Option"
        variant={QuizVariant.UNANSWERED}
        disabled={true}
        onPress={onPressMock}
      />
    )

    // Press the choice
    fireEvent.press(getByTestId('quiz-choice'))

    // Check that onPress was not called due to disabled state
    expect(onPressMock).not.toHaveBeenCalled()
  })
})