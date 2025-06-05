import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Tables } from '@/database.types'
import { styles } from './styles'

type RankingTabsProps = {
  currentIndex: number
  groups: Tables<'idol_groups'>[]
  onTabPress: (index: number) => void
}

export function RankingTabs({
  currentIndex,
  groups,
  onTabPress,
}: RankingTabsProps) {

  return (
    <View style={styles.tabsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScrollContent}
      >
        <TouchableOpacity
          style={[styles.tab, currentIndex === 0 && styles.activeTab]}
          onPress={() => onTabPress(0)}
        >
          <Text
            style={[
              styles.tabText,
              currentIndex === 0 && styles.activeTabText,
            ]}
          >
            Total
          </Text>
        </TouchableOpacity>

        <View style={styles.tabDivider} />

        {groups.map((group, index) => (
          <TouchableOpacity
            key={group.idol_group_id}
            style={[
              styles.tab,
              currentIndex === index + 1 && styles.activeTab,
            ]}
            onPress={() => onTabPress(index + 1)}
          >
            <Text
              style={[
                styles.tabText,
                currentIndex === index + 1 && styles.activeTabText,
              ]}
            >
              {group.idol_group_name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}
