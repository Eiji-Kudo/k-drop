import { Colors } from '@/constants/Colors'
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons'

type BentoIconProps = {
  color?: string
  size?: number
}

export function QuizIcon({ color = Colors.white, size = 30 }: BentoIconProps) {
  return <FontAwesome name="pencil-square-o" size={size} color={color} />
}

export function CreateIcon({
  color = Colors.tertiary,
  size = 28,
}: BentoIconProps) {
  return <FontAwesome5 name="plus-circle" size={size} color={color} />
}

export function RankingIcon({
  color = Colors.sparkle,
  size = 26,
}: BentoIconProps) {
  return <FontAwesome5 name="chess-king" size={size} color={color} />
}

export function ProfileIcon({
  color = Colors.accent,
  size = 30,
}: BentoIconProps) {
  return <Ionicons name="person-circle" size={size} color={color} />
}
