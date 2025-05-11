import { useGlobalContext } from '@/context/GlobalContext'
import { useNextQuiz } from '@/features/answer-quiz/hooks/useNextQuiz'
import {
  useQuiz,
  useQuizChoices,
} from '@/features/answer-quiz/hooks/useQuizQuery'
import { useAppUser } from '@/hooks/useAppUser'
import { supabase } from '@/utils/supabase'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import {
  mockChoices,
  mockNavigation,
  mockQuiz,
  mockQuizId,
  mockSetAnsweredQuizIds,
} from './quizNavigationMocks'

export const setupMocks = () => {
  jest.clearAllMocks()
  ;(useLocalSearchParams as jest.Mock).mockReturnValue({
    quizId: mockQuizId.toString(),
  })
  ;(useNavigation as jest.Mock).mockReturnValue(mockNavigation)
  ;(useGlobalContext as jest.Mock).mockReturnValue({
    selectedQuizIds: [mockQuizId, mockQuizId + 1],
    answeredQuizIds: [],
    setAnsweredQuizIds: mockSetAnsweredQuizIds,
  })
  ;(useQuiz as jest.Mock).mockReturnValue({ data: mockQuiz })
  ;(useQuizChoices as jest.Mock).mockReturnValue({ data: mockChoices })
  ;(useNextQuiz as jest.Mock).mockReturnValue({
    getNextQuiz: jest.fn().mockReturnValue(mockQuizId + 1),
  })
  ;(useAppUser as jest.Mock).mockReturnValue({ appUserId: 'user123' })
  ;(supabase.from as jest.Mock).mockReturnValue({
    insert: jest.fn().mockResolvedValue({ data: null, error: null }),
  })
  jest.useFakeTimers()
}
