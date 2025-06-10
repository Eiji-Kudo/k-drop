import { Colors } from '@/constants/Colors'

export type DailyScore = {
  date: Date
  score: number
}

export const prepareChartData = (dailyScores: DailyScore[]) => {
  const last7Days = dailyScores.slice(-7)

  const labels = last7Days.map((item) => {
    const date = new Date(item.date)
    return `Day ${date.getDate()}`
  })

  const data = last7Days.map((item) => item.score)

  return {
    labels,
    datasets: [
      {
        data: data.length > 0 ? data : [0],
      },
    ],
  }
}

export const chartConfig = {
  backgroundColor: Colors.background,
  backgroundGradientFrom: Colors.background,
  backgroundGradientTo: Colors.background,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 159, 204, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
  style: {
    borderRadius: 10,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: Colors.primary,
  },
}
