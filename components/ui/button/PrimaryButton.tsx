import { Colors } from '@/constants/Colors'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type PrimaryButtonProps = React.ComponentProps<typeof TouchableOpacity> & {
  children: React.ReactNode
}

export function PrimaryButton({ children, disabled, ...props }: PrimaryButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        disabled && styles.buttonDisabled,
        props.style
      ]} 
      disabled={disabled} 
      {...props}
    >
      <View style={styles.buttonContent}>
        {typeof children === 'string' ? (
          <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 12,
  },
  buttonDisabled: {
    backgroundColor: Colors.disabled,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonTextDisabled: {
    color: Colors.disabledText,
  },
})
