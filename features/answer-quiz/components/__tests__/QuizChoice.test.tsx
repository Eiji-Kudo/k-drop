/**
 * Simplified test for QuizChoice component
 */
import React from 'react'
import renderer from 'react-test-renderer'
import { QuizVariant } from '@/features/answer-quiz/constants/quizVariant'
import { QuizChoice } from '@/features/answer-quiz/components/QuizChoice'

// This test focuses only on snapshots to avoid timeouts with @testing-library/react-native
describe('QuizChoice', () => {
  // Set mock for consistency
  const mockOnPress = jest.fn()

  // Basic render test
  it('renders correctly with the right label', () => {
    const tree = renderer
      .create(
        <QuizChoice
          index={0}
          label="Test Option"
          variant={QuizVariant.UNANSWERED}
          onPress={mockOnPress}
        />,
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  // Verify correct styling for correct answers
  it('applies correct styling when answer is correct', () => {
    const tree = renderer
      .create(
        <QuizChoice
          index={0}
          label="Test Option"
          variant={QuizVariant.CORRECT}
          onPress={mockOnPress}
        />,
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  // Verify correct styling for incorrect answers
  it('applies incorrect styling when answer is incorrect', () => {
    const tree = renderer
      .create(
        <QuizChoice
          index={0}
          label="Test Option"
          variant={QuizVariant.INCORRECT}
          onPress={mockOnPress}
        />,
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
