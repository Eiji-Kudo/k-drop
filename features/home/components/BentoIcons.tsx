import { Colors } from '@/constants/Colors'
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons'

export function QuizIcon() {
  return <FontAwesome name="pencil-square-o" size={32} color={Colors.white} />
}

export function CreateIcon() {
  return <FontAwesome5 name="plus-circle" size={32} color={Colors.tertiary} />
}

export function RankingIcon() {
  return <FontAwesome5 name="chess-king" size={28} color={Colors.sparkle} />
}

export function ProfileIcon() {
  return <Ionicons name="person-circle" size={32} color={Colors.accent} />
}
