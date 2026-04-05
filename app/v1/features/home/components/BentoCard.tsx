import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { MotiPressable } from 'moti/interactions'
import { MotiView } from 'moti'
import { View } from 'react-native'
import { styles } from './BentoCard.styles'
import { BentoCardContent } from './BentoCardContent'
import { bentoCardVariantTokens } from './BentoCard.tokens'
import type { BentoCardProps } from './BentoCard.types'

export function BentoCard({
  title,
  subtitle,
  eyebrow,
  icon,
  onPress,
  size = 'medium',
  variant = 'default',
  delay = 0,
  showArrow = false,
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

  const tokens = bentoCardVariantTokens[variant]

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay }}
    >
      <MotiPressable
        disabled={!onPress}
        onPress={handlePress}
        animate={({ pressed }) => {
          'worklet'
          return { scale: onPress && pressed ? 0.97 : 1 }
        }}
        transition={{ type: 'timing', duration: 100 }}
      >
        {tokens.gradientColors ? (
          <LinearGradient
            colors={tokens.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              cardStyles,
              styles.cardGradient,
              { borderColor: tokens.borderColor },
            ]}
          >
            <BentoCardContent
              eyebrow={eyebrow}
              icon={icon}
              showArrow={showArrow}
              size={size}
              subtitle={subtitle}
              title={title}
              tokens={tokens}
            />
          </LinearGradient>
        ) : (
          <View
            style={[
              cardStyles,
              styles.cardDefault,
              {
                backgroundColor: tokens.backgroundColor,
                borderColor: tokens.borderColor,
              },
            ]}
          >
            <BentoCardContent
              eyebrow={eyebrow}
              icon={icon}
              showArrow={showArrow}
              size={size}
              subtitle={subtitle}
              title={title}
              tokens={tokens}
            />
          </View>
        )}
      </MotiPressable>
    </MotiView>
  )
}
