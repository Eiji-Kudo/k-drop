import { View, Dimensions } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { ThemedText } from '@/components/ThemedText'
import {
  type DailyScore,
  prepareChartData,
  chartConfig,
} from '../../utils/chartUtils'
import { styles } from './styles'

type ProfileProgressProps = {
  dailyScores: DailyScore[]
  percentageIncrease?: number
}

export function ProfileProgress({
  dailyScores,
  percentageIncrease,
}: ProfileProgressProps) {
  const screenWidth = Dimensions.get('window').width
  const chartData = prepareChartData(dailyScores)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>
          Power Progress
        </ThemedText>
        <View style={styles.statsContainer}>
          <ThemedText type="title" style={styles.currentScore}>
            {dailyScores.length > 0
              ? dailyScores[dailyScores.length - 1].score
              : 0}
          </ThemedText>
          {percentageIncrease !== undefined && (
            <ThemedText type="default" style={styles.percentage}>
              Last 7 Days: {percentageIncrease >= 0 ? '+' : ''}
              {percentageIncrease}%
            </ThemedText>
          )}
        </View>
      </View>

      {dailyScores.length > 0 ? (
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      ) : (
        <View style={styles.emptyState}>
          <ThemedText type="default" style={styles.emptyText}>
            Start answering quizzes to see your progress!
          </ThemedText>
        </View>
      )}
    </View>
  )
}
