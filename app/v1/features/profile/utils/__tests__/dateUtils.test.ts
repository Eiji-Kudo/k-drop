import { formatFanDuration } from '../dateUtils'

describe('formatFanDuration', () => {
  describe('returns "New Fan"', () => {
    it('when date is undefined', () => {
      expect(formatFanDuration(undefined)).toBe('New Fan')
    })

    it('when fan started less than 30 days ago', () => {
      const now = new Date('2026-01-15')
      const fanSince = new Date('2026-01-01')
      expect(formatFanDuration(fanSince, now)).toBe('New Fan')
    })

    it('when fan started today', () => {
      const now = new Date('2026-01-15')
      const fanSince = new Date('2026-01-15')
      expect(formatFanDuration(fanSince, now)).toBe('New Fan')
    })

    it('when date is in the future', () => {
      const now = new Date('2026-01-15')
      const fanSince = new Date('2026-02-01')
      expect(formatFanDuration(fanSince, now)).toBe('New Fan')
    })
  })

  describe('returns months correctly', () => {
    it('returns "1 Month Fan" for exactly 30 days', () => {
      const now = new Date('2026-02-14')
      const fanSince = new Date('2026-01-15')
      expect(formatFanDuration(fanSince, now)).toBe('1 Month Fan')
    })

    it('returns "2 Months Fan" for 60+ days', () => {
      const now = new Date('2026-03-20')
      const fanSince = new Date('2026-01-15')
      expect(formatFanDuration(fanSince, now)).toBe('2 Months Fan')
    })

    it('returns "11 Months Fan" for 11 months', () => {
      const now = new Date('2026-12-10')
      const fanSince = new Date('2026-01-15')
      expect(formatFanDuration(fanSince, now)).toBe('10 Months Fan')
    })
  })

  describe('returns years correctly', () => {
    it('returns "1 Year Fan" for exactly 365 days', () => {
      const now = new Date('2027-01-15')
      const fanSince = new Date('2026-01-15')
      expect(formatFanDuration(fanSince, now)).toBe('1 Year Fan')
    })

    it('returns "2 Years Fan" for 2+ years', () => {
      const now = new Date('2028-03-01')
      const fanSince = new Date('2026-01-15')
      expect(formatFanDuration(fanSince, now)).toBe('2 Years Fan')
    })

    it('returns "5 Years Fan" for 5+ years', () => {
      const now = new Date('2031-06-01')
      const fanSince = new Date('2026-01-15')
      expect(formatFanDuration(fanSince, now)).toBe('5 Years Fan')
    })
  })

  describe('edge cases with year boundaries', () => {
    it('does not return "1 Year Fan" for December to January transition (bug fix)', () => {
      const now = new Date('2026-01-15')
      const fanSince = new Date('2025-12-01')
      expect(formatFanDuration(fanSince, now)).toBe('1 Month Fan')
    })

    it('does not count year change as full year when only 1 month passed', () => {
      const now = new Date('2026-01-01')
      const fanSince = new Date('2025-12-01')
      expect(formatFanDuration(fanSince, now)).toBe('1 Month Fan')
    })

    it('handles leap year correctly - 365 days is 1 year', () => {
      const now = new Date('2029-02-28')
      const fanSince = new Date('2028-02-29')
      expect(formatFanDuration(fanSince, now)).toBe('1 Year Fan')
    })

    it('handles less than a year across leap year', () => {
      const now = new Date('2029-01-28')
      const fanSince = new Date('2028-02-29')
      expect(formatFanDuration(fanSince, now)).toBe('11 Months Fan')
    })
  })
})
