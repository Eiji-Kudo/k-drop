import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase'
import { useAppUser } from '@/hooks/useAppUser'
import type { Tables } from '@/database.types'

type DailyScore = {
  date: Date
  score: number
}

export function useDailyScores() {
  const { appUserId } = useAppUser()

  return useQuery({
    queryKey: ['dailyScores', appUserId],
    queryFn: async () => {
      if (!appUserId) throw new Error('No user ID')

      // Get scores for the last 7 days
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { data, error } = await supabase
        .from('daily_score_histories')
        .select('date, total_score')
        .eq('app_user_id', appUserId)
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true })
        .returns<
          Pick<Tables<'daily_score_histories'>, 'date' | 'total_score'>[]
        >()

      if (error) throw error

      const dailyScores: DailyScore[] = (data || []).map((item) => ({
        date: new Date(item.date),
        score: item.total_score,
      }))

      // Calculate percentage increase
      let percentageIncrease = 0
      if (dailyScores.length >= 2) {
        const firstScore = dailyScores[0].score
        const lastScore = dailyScores[dailyScores.length - 1].score
        if (firstScore > 0) {
          percentageIncrease = Math.round(
            ((lastScore - firstScore) / firstScore) * 100,
          )
        }
      }

      return {
        dailyScores,
        percentageIncrease,
      }
    },
    enabled: !!appUserId,
  })
}
