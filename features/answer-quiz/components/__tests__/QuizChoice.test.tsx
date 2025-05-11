import { QuizChoice } from '@/features/answer-quiz/components/QuizChoice'
import { QuizVariant } from '@/features/answer-quiz/constants/quizVariant'
import renderer from 'react-test-renderer'

describe('QuizChoice', () => {
  const mockOnPress = jest.fn()

  beforeEach(() => {
    mockOnPress.mockReset()
  })

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

  it('applies incorrect styling when answer is incorrect', () => {
    const tree = renderer
      .create(
        <QuizChoice
          index={0}
          label="Test Option"
          variant={QuizVariant.INCORRECT}
          onPress={mockOnPress}
          testID="quiz-choice"
        />,
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
