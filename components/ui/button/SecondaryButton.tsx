import { Colors } from '@/constants/Colors'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type SecondaryButtonProps = React.ComponentProps<typeof TouchableOpacity> & {
  children: React.ReactNode
}

export function SecondaryButton({ children, ...props }: SecondaryButtonProps) {
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
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    padding: 12,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.text,
    fontSize: 20,
    textAlign: 'center',
  },
})
