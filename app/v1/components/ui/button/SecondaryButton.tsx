import { Colors } from '@/constants/Colors'
import * as Haptics from 'expo-haptics'
import { MotiPressable } from 'moti/interactions'
import { StyleSheet, Text, View } from 'react-native'

type SecondaryButtonProps = {
  children: React.ReactNode
  onPress?: () => void
  disabled?: boolean
  style?: object
}

export function SecondaryButton({
  children,
  disabled,
  onPress,
  style,
}: SecondaryButtonProps) {
  const handlePress = async () => {
    if (!disabled && onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      onPress()
    }
  }

  return (
    <MotiPressable
      onPress={handlePress}
      disabled={disabled}
      animate={({ pressed }) => {
        'worklet'
        return {
          scale: pressed ? 0.96 : 1,
        }
      }}
      transition={{ type: 'timing', duration: 100 }}
      style={style}
    >
      <View style={[styles.button, disabled && styles.buttonDisabled]}>
        <View style={styles.buttonContent}>
          {typeof children === 'string' ? (
            <Text
              style={[styles.buttonText, disabled && styles.buttonTextDisabled]}
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      </View>
    </MotiPressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    padding: 16,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.lightGray,
  },
  buttonText: {
    color: Colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextDisabled: {
    color: Colors.text.disabled,
  },
})
