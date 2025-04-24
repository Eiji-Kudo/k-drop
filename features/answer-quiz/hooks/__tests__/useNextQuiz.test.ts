import { useGlobalContext } from '@/context/GlobalContext'
import { renderHook } from '@testing-library/react'
import { useNextQuiz } from '../useNextQuiz'

// Mock the context
jest.mock('@/context/GlobalContext', () => ({
  useGlobalContext: jest.fn(),
}))

describe('useNextQuiz', () => {
  let mockSetSelectedQuizIds: jest.Mock

  beforeEach(() => {
    mockSetSelectedQuizIds = jest.fn()

    // デフォルトのモック値を設定
    ;(useGlobalContext as jest.Mock).mockReturnValue({
      selectedQuizIds: [],
      setSelectedQuizIds: mockSetSelectedQuizIds,
    })
  })

  it('should return null when no quizzes are available', () => {
    const { result } = renderHook(() => useNextQuiz())

    expect(result.current.getNextQuiz()).toBeNull()
    expect(mockSetSelectedQuizIds).not.toHaveBeenCalled()
  })

  it('should return the next quiz and update the queue', () => {
    // キューにクイズIDがある状態をセット
    ;(useGlobalContext as jest.Mock).mockReturnValue({
      selectedQuizIds: ['quiz1', 'quiz2', 'quiz3'],
      setSelectedQuizIds: mockSetSelectedQuizIds,
    })

    const { result } = renderHook(() => useNextQuiz())

    // getNextQuizを呼び出し
    const nextQuiz = result.current.getNextQuiz()

    expect(nextQuiz).toBe('quiz1')
    expect(mockSetSelectedQuizIds).toHaveBeenCalledWith(['quiz2', 'quiz3'])
  })

  it('should handle the last quiz correctly', () => {
    // キューに最後の1つだけある状態をセット
    ;(useGlobalContext as jest.Mock).mockReturnValue({
      selectedQuizIds: ['lastQuiz'],
      setSelectedQuizIds: mockSetSelectedQuizIds,
    })

    const { result } = renderHook(() => useNextQuiz())

    // 最後のクイズを取得
    const nextQuiz = result.current.getNextQuiz()

    expect(nextQuiz).toBe('lastQuiz')
    expect(mockSetSelectedQuizIds).toHaveBeenCalledWith([])
  })
})
