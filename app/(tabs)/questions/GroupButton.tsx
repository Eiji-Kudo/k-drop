import { ThemedText } from '@/components/ThemedText'
import { SecondaryButton } from '@/components/ui/button/SecondaryButton'
import { styles } from './_styles'

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
