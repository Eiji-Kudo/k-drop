import { Tables } from '@/database.types'
import { supabase } from '@/utils/supabase'
import { useQuery } from '@tanstack/react-query'

export type QuizResult = {
  quiz: Tables<'quizzes'>
  choices: Tables<'quiz_choices'>[]
  userAnswer: Tables<'user_quiz_answers'>
}

export const useQuizResults = (quizIds: number[]) => {
  const queryResult = useQuery({
    queryKey: ['quizResults', quizIds],
    queryFn: () => getQuizResults(quizIds),
    enabled: quizIds.length > 0,
  })

  return {
    queryResult,
  }
}

// ユーザーの回答を取得
async function fetchUserAnswers(quizIds: number[]) {
  const { data, error } = await supabase
    .from('user_quiz_answers')
    .select('*')
    .in('quiz_id', quizIds)
    .order('answered_at', { ascending: false })
  if (error) throw error
  return data
}

// クイズ情報をIDリストで取得
async function fetchQuizzesByIds(quizIds: number[]) {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .in('quiz_id', quizIds)
  if (error) throw error
  return data
}

// 選択肢をIDリストで取得
async function fetchChoicesByIds(quizIds: number[]) {
  const { data, error } = await supabase
    .from('quiz_choices')
    .select('*')
    .in('quiz_id', quizIds)
  if (error) throw error
  return data
}

// 選択肢リストをquiz_idごとにグループ化
function groupChoicesByQuiz(
  choicesList: Tables<'quiz_choices'>[],
): Record<number, Tables<'quiz_choices'>[]> {
  return choicesList.reduce<Record<number, Tables<'quiz_choices'>[]>>(
    (acc, choice) => {
      const key = choice.quiz_id
      if (!acc[key]) acc[key] = []
      acc[key].push(choice)
      return acc
    },
    {},
  )
}

// 結果とスコアを集計
function calculateQuizResults(
  userAnswers: Tables<'user_quiz_answers'>[],
  quizzes: Tables<'quizzes'>[],
  choicesByQuiz: Record<number, Tables<'quiz_choices'>[]>,
) {
  let totalScore = 0
  let correctCount = 0
  const results: QuizResult[] = userAnswers.map((answer) => {
    const quiz = quizzes.find((q) => q.quiz_id === answer.quiz_id)!
    const choices = choicesByQuiz[answer.quiz_id] || []
    if (answer.is_correct) {
      totalScore += 100
      correctCount += 1
    }
    return { quiz, choices, userAnswer: answer }
  })
  return { results, totalScore, correctCount }
}

// 全体の取得と集約を実行
async function getQuizResults(quizIds: number[]) {
  if (quizIds.length === 0) {
    return { results: [], totalScore: 0, correctCount: 0 }
  }
  const userAnswers = await fetchUserAnswers(quizIds)
  const quizIdsSet = userAnswers.map((a) => a.quiz_id)
  const quizzes = await fetchQuizzesByIds(quizIdsSet)
  const choicesList = await fetchChoicesByIds(quizIdsSet)
  const choicesByQuiz = groupChoicesByQuiz(choicesList)
  return calculateQuizResults(userAnswers, quizzes, choicesByQuiz)
}
