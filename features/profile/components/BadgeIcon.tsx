import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'
import { BadgeType } from '../types/badge'

type BadgeIconProps = {
  type: BadgeType
  size?: number
}

export function BadgeIcon({ type, size = 24 }: BadgeIconProps) {
  switch (type) {
    case 'quiz_master':
      return <FontAwesome5 name="brain" size={size} />
    case 'concert_goer':
      return <MaterialCommunityIcons name="ticket" size={size} />
    case 'photocard_collector':
      return <MaterialCommunityIcons name="cards" size={size} />
    case 'dance_cover_star':
      return <MaterialCommunityIcons name="dance-ballroom" size={size} />
  }
}
