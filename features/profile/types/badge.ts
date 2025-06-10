export type BadgeType =
  | 'quiz_master'
  | 'concert_goer'
  | 'photocard_collector'
  | 'dance_cover_star'

export type Badge = {
  type: BadgeType
  name: string
  level: number // 1=Bronze, 2=Silver, 3=Gold
}
