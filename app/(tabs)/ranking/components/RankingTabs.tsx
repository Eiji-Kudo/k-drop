import { View, TouchableOpacity } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { styles } from '../styles'

type RankingTabsProps = {
  activeTab: 'total' | 'group'
  onTabChange: (tab: 'total' | 'group') => void
}

export function RankingTabs({ activeTab, onTabChange }: RankingTabsProps) {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'total' && styles.activeTab]}
        onPress={() => onTabChange('total')}
      >
        <ThemedText
          style={[
            styles.tabText,
            activeTab === 'total' && styles.activeTabText,
          ]}
        >
          Total Ranking
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'group' && styles.activeTab]}
        onPress={() => onTabChange('group')}
      >
        <ThemedText
          style={[
            styles.tabText,
            activeTab === 'group' && styles.activeTabText,
          ]}
        >
          Group Ranking
        </ThemedText>
      </TouchableOpacity>
    </View>
  )
}
