/**
 * Test for QuizChoice component using React Native Testing Library
 */
import { QuizChoice } from '@/features/answer-quiz/components/QuizChoice'
import { QuizVariant } from '@/features/answer-quiz/constants/quizVariant'
import renderer from 'react-test-renderer'

// スナップショットテストに戻して安定性を確保
describe('QuizChoice', () => {
  // Set mock for consistency
  const mockOnPress = jest.fn()

  beforeEach(() => {
    // Reset the mock before each test
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

    // スナップショットで全体構造を確認
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

    // 正解の場合のスタイルが適用されていることを確認
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

    // 不正解の場合のスタイルが適用されていることを確認
    expect(tree).toMatchSnapshot()
  })
})
