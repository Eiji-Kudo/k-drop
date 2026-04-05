import { Colors } from '@/constants/Colors'

export type BentoCardVariant =
  | 'default'
  | 'gradient'
  | 'accent'
  | 'rose'
  | 'gold'

export type BentoCardVariantToken = {
  arrowBackground: string
  arrowColor: string
  backgroundColor: string
  borderColor: string
  eyebrowColor: string
  gradientColors: readonly [string, string, ...string[]] | null
  iconBadgeBackground: string
  subtitleColor: string
  titleColor: string
}

export const bentoCardVariantTokens: Record<
  BentoCardVariant,
  BentoCardVariantToken
> = {
  accent: {
    arrowBackground: '#E7DBFF',
    arrowColor: Colors.home.ink,
    backgroundColor: Colors.home.surfaceLilac,
    borderColor: '#E7DBFF',
    eyebrowColor: Colors.home.subtle,
    gradientColors: null,
    iconBadgeBackground: '#EEE3FF',
    subtitleColor: Colors.home.muted,
    titleColor: Colors.home.ink,
  },
  default: {
    arrowBackground: Colors.home.surfaceGold,
    arrowColor: Colors.home.ink,
    backgroundColor: Colors.home.surface,
    borderColor: Colors.home.border,
    eyebrowColor: Colors.home.subtle,
    gradientColors: null,
    iconBadgeBackground: Colors.home.surfaceRose,
    subtitleColor: Colors.home.muted,
    titleColor: Colors.home.ink,
  },
  gold: {
    arrowBackground: '#FFE8BA',
    arrowColor: Colors.home.ink,
    backgroundColor: Colors.home.surfaceGold,
    borderColor: '#F4DFB0',
    eyebrowColor: '#B08728',
    gradientColors: null,
    iconBadgeBackground: '#FFEBC2',
    subtitleColor: Colors.home.muted,
    titleColor: Colors.home.ink,
  },
  gradient: {
    arrowBackground: 'rgba(255,255,255,0.18)',
    arrowColor: Colors.white,
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.18)',
    eyebrowColor: 'rgba(255,255,255,0.82)',
    gradientColors: Colors.gradients.spotlight,
    iconBadgeBackground: 'rgba(255,255,255,0.16)',
    subtitleColor: 'rgba(255,255,255,0.86)',
    titleColor: Colors.white,
  },
  rose: {
    arrowBackground: '#FFD7E7',
    arrowColor: Colors.home.ink,
    backgroundColor: Colors.home.surfaceRose,
    borderColor: '#F7D0E0',
    eyebrowColor: '#B7648A',
    gradientColors: null,
    iconBadgeBackground: '#FFE0ED',
    subtitleColor: Colors.home.muted,
    titleColor: Colors.home.ink,
  },
}
