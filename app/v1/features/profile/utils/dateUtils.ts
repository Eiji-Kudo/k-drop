export const formatFanDuration = (
  date?: Date,
  now: Date = new Date(),
): string => {
  if (!date) return 'New Fan'

  const diffTime = now.getTime() - date.getTime()
  if (diffTime < 0) return 'New Fan'

  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  const years = Math.floor(diffDays / 365)
  const months = Math.floor((diffDays % 365) / 30)

  if (years > 0) {
    return `${years} Year${years > 1 ? 's' : ''} Fan`
  } else if (months > 0) {
    return `${months} Month${months > 1 ? 's' : ''} Fan`
  } else {
    return 'New Fan'
  }
}
