import { View, StyleSheet, Image, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'

type ProfileHeaderProps = {
  userName: string
  nickname?: string
  avatarUrl?: string
  onSettingsPress?: () => void
}

export function ProfileHeader({
  userName,
  nickname,
  avatarUrl,
  onSettingsPress,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={40} color={Colors.text.secondary} />
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <ThemedText type="title" style={styles.userName}>
          {userName}
        </ThemedText>
        {nickname && (
          <ThemedText type="default" style={styles.nickname}>
            {nickname}
          </ThemedText>
        )}
      </View>

      {onSettingsPress && (
        <Pressable onPress={onSettingsPress} style={styles.settingsButton}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={Colors.text.primary}
          />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 40,
    height: 80,
    width: 80,
  },
  avatarContainer: {},
  avatarPlaceholder: {
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  nickname: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  settingsButton: {
    padding: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})
