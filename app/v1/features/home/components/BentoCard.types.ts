import type { ReactNode } from 'react'
import type { ViewStyle } from 'react-native'
import type {
  BentoCardVariant,
  BentoCardVariantToken,
} from './BentoCard.tokens'

type BentoCardSize = 'small' | 'medium' | 'large' | 'wide'

export type BentoCardProps = {
  title: string
  subtitle?: string
  eyebrow?: string
  icon: ReactNode
  onPress?: () => void
  size?: BentoCardSize
  variant?: BentoCardVariant
  delay?: number
  showArrow?: boolean
  style?: ViewStyle
}

export type BentoCardContentProps = {
  eyebrow?: string
  icon: ReactNode
  showArrow: boolean
  size: BentoCardSize
  subtitle?: string
  title: string
  tokens: BentoCardVariantToken
}
