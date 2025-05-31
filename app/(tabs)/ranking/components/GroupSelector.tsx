import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { Tables } from '@/database.types'

type GroupSelectorProps = {
  idolGroups: Tables<'idol_groups'>[]
  selectedGroupId: number | null
  onSelectGroup: (groupId: number | null) => void
}

export function GroupSelector({
  idolGroups,
  selectedGroupId,
  onSelectGroup,
}: GroupSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.groupSelector}
    >
      {idolGroups.map((group) => (
        <TouchableOpacity
          key={group.idol_group_id}
          style={[
            styles.groupChip,
            selectedGroupId === group.idol_group_id && styles.groupChipSelected,
          ]}
          onPress={() => onSelectGroup(group.idol_group_id)}
        >
          <ThemedText
            style={[
              styles.groupChipText,
              selectedGroupId === group.idol_group_id &&
                styles.groupChipTextSelected,
            ]}
          >
            {group.idol_group_name}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  groupChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  groupChipSelected: {
    backgroundColor: Colors.primary,
  },
  groupChipText: {
    color: '#666',
    fontSize: 14,
  },
  groupChipTextSelected: {
    color: 'white',
  },
  groupSelector: {
    backgroundColor: Colors.background,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
})
