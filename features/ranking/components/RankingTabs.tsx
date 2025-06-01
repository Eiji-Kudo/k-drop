import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Tables } from '@/database.types';

interface RankingTabsProps {
  activeTab: 'total' | 'group';
  selectedGroupId: number | null;
  groups: Tables<'idol_groups'>[];
  onTabChange: (tab: 'total' | 'group') => void;
  onGroupSelect: (groupId: number) => void;
}

export function RankingTabs({
  activeTab,
  selectedGroupId,
  groups,
  onTabChange,
  onGroupSelect,
}: RankingTabsProps) {
  const handleGroupTabPress = (groupId: number) => {
    onTabChange('group');
    onGroupSelect(groupId);
  };

  return (
    <View style={styles.tabsContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScrollContent}
      >
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'total' && styles.activeTab,
          ]}
          onPress={() => onTabChange('total')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'total' && styles.activeTabText,
            ]}
          >
            Total
          </Text>
        </TouchableOpacity>

        <View style={styles.tabDivider} />

        {groups.map((group) => (
          <TouchableOpacity
            key={group.idol_group_id}
            style={[
              styles.tab,
              activeTab === 'group' && selectedGroupId === group.idol_group_id && styles.activeTab,
            ]}
            onPress={() => handleGroupTabPress(group.idol_group_id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'group' && selectedGroupId === group.idol_group_id && styles.activeTabText,
              ]}
            >
              {group.idol_group_name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    backgroundColor: Colors.background,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  tabsScrollContent: {
    paddingHorizontal: 8,
  },
  tab: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  activeTab: {
    borderBottomColor: Colors.primary,
    borderBottomWidth: 2,
  },
  tabText: {
    color: '#666',
    fontSize: 16,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  tabDivider: {
    backgroundColor: '#e0e0e0',
    width: 1,
    marginVertical: 12,
  },
});