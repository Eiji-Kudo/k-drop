import { View, ScrollView } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { BadgeIcon } from '../BadgeIcon'
import { getBadgesFromLayers, getBadgeColor } from '../../utils/badgeUtils'
import { styles } from './styles'

type ProfileBadgesProps = {
  totalLayerId?: number
  groupLayerIds?: { groupId: number; layerId: number }[]
}

export function ProfileBadges({
  totalLayerId,
  groupLayerIds,
}: ProfileBadgesProps) {
  const badges = getBadgesFromLayers(totalLayerId, groupLayerIds)

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        My Badges
      </ThemedText>

      {badges.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.badgeList}
        >
          {badges.map((badge, index) => (
            <View key={index} style={styles.badgeItem}>
              <View
                style={[
                  styles.badgeIcon,
                  { backgroundColor: getBadgeColor(badge.level) },
                ]}
              >
                <BadgeIcon type={badge.type} />
              </View>
              <ThemedText type="default" style={styles.badgeName}>
                {badge.name}
              </ThemedText>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <ThemedText type="default" style={styles.emptyText}>
            Keep playing to earn badges!
          </ThemedText>
        </View>
      )}

      <ThemedText type="default" style={styles.viewAll}>
        View All Badges
      </ThemedText>
    </View>
  )
}
