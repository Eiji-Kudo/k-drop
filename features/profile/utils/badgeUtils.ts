import { Badge } from '../types/badge'

export const getBadgesFromLayers = (
  totalLayerId?: number,
  groupLayerIds?: { groupId: number; layerId: number }[],
): Badge[] => {
  const badges: Badge[] = []

  // Quiz Master badge based on total layer
  if (totalLayerId && totalLayerId >= 3) {
    badges.push({
      type: 'quiz_master',
      name: 'Quiz Master',
      level: totalLayerId >= 5 ? 3 : totalLayerId >= 4 ? 2 : 1,
    })
  }

  // Concert Goer badge (mock - would be based on event attendance)
  if (totalLayerId && totalLayerId >= 2) {
    badges.push({
      type: 'concert_goer',
      name: 'Concert Goer',
      level: 1,
    })
  }

  // Photocard Collector badge (mock)
  if (groupLayerIds && groupLayerIds.length >= 3) {
    badges.push({
      type: 'photocard_collector',
      name: 'Photocard Collector',
      level: groupLayerIds.length >= 5 ? 2 : 1,
    })
  }

  // Dance Cover Star badge (mock)
  if (totalLayerId && totalLayerId >= 4) {
    badges.push({
      type: 'dance_cover_star',
      name: 'Dance Cover Star',
      level: 1,
    })
  }

  return badges
}

export const getBadgeColor = (level: number): string => {
  switch (level) {
    case 3:
      return '#FFD700' // Gold
    case 2:
      return '#C0C0C0' // Silver
    default:
      return '#CD7F32' // Bronze
  }
}
