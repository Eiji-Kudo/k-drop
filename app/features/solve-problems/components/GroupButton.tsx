import { ThemedText } from '@/components/ThemedText'
import { SecondaryButton } from '@/components/ui/button/SecondaryButton'
import { Colors } from '@/constants/Colors'
import { StyleSheet } from 'react-native'

type GroupButtonProps = {
  group: {
    idol_group_id: number
    idol_group_name: string
  }
  isSelected: boolean
  onPress: (groupId: number) => void
}

export function GroupButton({ group, isSelected, onPress }: GroupButtonProps) {
  return (
    <SecondaryButton
      onPress={() => onPress(group.idol_group_id)}
      style={[styles.groupButton, isSelected && styles.selectedGroupButton]}
    >
      <ThemedText style={styles.groupButtonText}>{group.idol_group_name}</ThemedText>
    </SecondaryButton>
  )
}

const styles = StyleSheet.create({
  groupButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
  },
  groupButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedGroupButton: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
})
