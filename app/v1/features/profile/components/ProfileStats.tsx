import { View, StyleSheet } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { formatFanDuration } from '../utils/dateUtils'

type ProfileStatsProps = {
  totalOtakuPower: number
  fanSince?: Date
  layerName?: string
}

export function ProfileStats({
  totalOtakuPower,
  fanSince,
  layerName,
}: ProfileStatsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.statCard}>
        <ThemedText type="subtitle" style={styles.label}>
          Otaku Power
        </ThemedText>
        <ThemedText type="title" style={styles.value}>
          {totalOtakuPower}
        </ThemedText>
        {layerName && (
          <ThemedText type="default" style={styles.layerName}>
            {layerName}
          </ThemedText>
        )}
      </View>

      <View style={styles.statCard}>
        <ThemedText type="subtitle" style={styles.label}>
          Fan Since
        </ThemedText>
        <ThemedText type="title" style={styles.value}>
          {formatFanDuration(fanSince)}
        </ThemedText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: {
    color: Colors.text.secondary,
    fontSize: 12,
  },
  layerName: {
    color: Colors.primary,
    fontSize: 12,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    flex: 1,
    gap: 4,
    padding: 16,
  },
  value: {
    color: Colors.text.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
})
