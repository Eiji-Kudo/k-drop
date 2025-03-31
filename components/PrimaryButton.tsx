import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

type PrimaryButtonProps = {
  children: React.ReactNode
  onPress?: () => void
}

export function PrimaryButton({ children, onPress }: PrimaryButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.buttonContent}>
        {typeof children === 'string' ? (
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>
            {children}
          </ThemedText>
        ) : (
          children
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.tint,
    borderRadius: 10,
    marginVertical: 16,
    padding: 4,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
}) 