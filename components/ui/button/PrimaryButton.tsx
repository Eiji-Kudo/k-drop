import { Colors } from '@/constants/Colors'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type PrimaryButtonProps = React.ComponentProps<typeof TouchableOpacity> & {
  children: React.ReactNode
}

export function PrimaryButton({ children, ...props }: PrimaryButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, props.style]} {...props}>
      <View style={styles.buttonContent}>
        {typeof children === 'string' ? (
          <Text style={styles.buttonText}>{children}</Text>
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
})
