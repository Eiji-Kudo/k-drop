import { Colors } from '@/constants/Colors'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { MotiPressable } from 'moti/interactions'
import { MotiView } from 'moti'
import { Text, View, ViewStyle } from 'react-native'
import { styles } from './BentoCard.styles'

type BentoCardProps = {
  title: string
  subtitle?: string
  icon: React.ReactNode
  onPress?: () => void
  size?: 'small' | 'medium' | 'large' | 'wide'
  variant?: 'default' | 'gradient' | 'accent'
  delay?: number
  style?: ViewStyle
}

export function BentoCard({
  title,
  subtitle,
  icon,
  onPress,
  size = 'medium',
  variant = 'default',
  delay = 0,
  style,
}: BentoCardProps) {
  const handlePress = async () => {
    if (onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      onPress()
    }
  }

  const cardStyles = [
    styles.card,
    size === 'small' && styles.cardSmall,
    size === 'large' && styles.cardLarge,
    size === 'wide' && styles.cardWide,
    style,
  ]

  const isWhiteText = variant === 'gradient' || variant === 'accent'

  const content = (
    <>
      <View>{icon}</View>
      <Text style={[styles.title, isWhiteText && styles.titleWhite]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, isWhiteText && styles.subtitleWhite]}>
          {subtitle}
        </Text>
      )}
    </>
  )

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay }}
    >
      <MotiPressable
        onPress={handlePress}
        animate={({ pressed }) => {
          'worklet'
          return { scale: pressed ? 0.97 : 1 }
        }}
        transition={{ type: 'timing', duration: 100 }}
      >
        {variant === 'gradient' ? (
          <LinearGradient
            colors={Colors.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={cardStyles}
          >
            {content}
          </LinearGradient>
        ) : variant === 'accent' ? (
          <LinearGradient
            colors={Colors.gradients.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={cardStyles}
          >
            {content}
          </LinearGradient>
        ) : (
          <View style={[cardStyles, styles.cardDefault]}>{content}</View>
        )}
      </MotiPressable>
    </MotiView>
  )
}
