import { Ionicons } from '@expo/vector-icons'
import { Text, View } from 'react-native'
import { styles } from './BentoCard.styles'
import type { BentoCardContentProps } from './BentoCard.types'

export function BentoCardContent({
  eyebrow,
  icon,
  showArrow,
  size,
  subtitle,
  title,
  tokens,
}: BentoCardContentProps) {
  return (
    <>
      <View style={styles.headerRow}>
        <View
          style={[
            styles.iconBadge,
            size === 'large' && styles.iconBadgeLarge,
            { backgroundColor: tokens.iconBadgeBackground },
          ]}
        >
          {icon}
        </View>
        {showArrow ? (
          <View
            style={[
              styles.arrowBadge,
              { backgroundColor: tokens.arrowBackground },
            ]}
          >
            <Ionicons
              name="arrow-forward"
              size={16}
              color={tokens.arrowColor}
            />
          </View>
        ) : null}
      </View>
      <View style={styles.textStack}>
        {eyebrow ? (
          <Text
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={[styles.eyebrow, { color: tokens.eyebrowColor }]}
          >
            {eyebrow}
          </Text>
        ) : null}
        <Text
          style={[
            styles.title,
            size === 'large' && styles.titleLarge,
            size === 'small' && styles.titleSmall,
            { color: tokens.titleColor },
          ]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[
              styles.subtitle,
              size === 'large' && styles.subtitleLarge,
              { color: tokens.subtitleColor },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </>
  )
}
