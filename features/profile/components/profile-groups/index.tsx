import { View, Image, FlatList } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { styles } from './styles'

type GroupData = {
  groupId: number
  groupName: string
  thumbnailImage?: string
  otakuScore: number
}

type ProfileGroupsProps = {
  groups: GroupData[]
}

export function ProfileGroups({ groups }: ProfileGroupsProps) {
  const renderGroup = ({ item }: { item: GroupData }) => (
    <View style={styles.groupItem}>
      {item.thumbnailImage ? (
        <Image
          source={{ uri: item.thumbnailImage }}
          style={styles.groupImage}
        />
      ) : (
        <View style={[styles.groupImage, styles.groupImagePlaceholder]}>
          <ThemedText type="default" style={styles.placeholderText}>
            {item.groupName.substring(0, 2)}
          </ThemedText>
        </View>
      )}
      <ThemedText type="default" style={styles.groupName}>
        {item.groupName}
      </ThemedText>
    </View>
  )

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        My Groups
      </ThemedText>

      {groups.length > 0 ? (
        <FlatList
          data={groups}
          renderItem={renderGroup}
          keyExtractor={(item) => item.groupId.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <ThemedText type="default" style={styles.emptyText}>
            Answer quizzes to track your favorite groups!
          </ThemedText>
        </View>
      )}
    </View>
  )
}
