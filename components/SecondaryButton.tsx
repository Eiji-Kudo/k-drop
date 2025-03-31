import { Colors } from '@/constants/Colors'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type SecondaryButtonProps = {
  children: React.ReactNode
  onPress?: () => void
}

export function SecondaryButton({ children, onPress }: SecondaryButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
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
