import { Colors } from '@/constants/Colors'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { MotiPressable } from 'moti/interactions'
import { StyleSheet, Text, View } from 'react-native'

type PrimaryButtonProps = {
  children: React.ReactNode
  onPress?: () => void
  disabled?: boolean
  style?: object
  useGradient?: boolean
  testID?: string
}

export function PrimaryButton({
  children,
  disabled,
  onPress,
  style,
  useGradient = false,
  testID,
}: PrimaryButtonProps) {
  const handlePress = async () => {
    if (!disabled && onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      onPress()
    }
  }

  const content = (
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
  )

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
      testID={testID}
    >
      {useGradient && !disabled ? (
        <LinearGradient
          colors={Colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, disabled && styles.buttonDisabled]}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.button, disabled && styles.buttonDisabled]}>
          {content}
        </View>
      )}
    </MotiPressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 16,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.disabled,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonTextDisabled: {
    color: Colors.text.disabled,
  },
})
