import { Colors } from '@/constants/Colors'
import { BlurView } from 'expo-blur'
import { useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native'

type ResultModalProps = {
  mark: { symbol: '◎' | '×'; color: string } | null
}

export const ResultModal = ({ mark }: ResultModalProps) => {
  const visible = !!mark
  const scaleAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (mark) {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()
    } else {
      scaleAnim.setValue(0)
    }
  }, [mark, scaleAnim])

  return (
    <Modal visible={visible} transparent>
      <View style={styles.markOverlay}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <BlurView
            intensity={60}
            tint="light"
            style={[
              styles.markTextContainer,
              { borderColor: mark?.color ?? Colors.primary },
            ]}
          >
            <View style={styles.resultTextContainer}>
              <Text
                style={[
                  styles.resultText,
                  { color: mark?.color ?? Colors.primary },
                ]}
              >
                {mark?.symbol === '◎' ? '正解!' : '不正解'}
              </Text>
              <Text
                style={[
                  styles.markText,
                  { color: mark?.color ?? Colors.primary },
                ]}
              >
                {mark?.symbol ?? ''}
              </Text>
            </View>
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  )
}

const WIDTH = Dimensions.get('window').width * 0.7

const styles = StyleSheet.create({
  markOverlay: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  markText: {
    fontSize: WIDTH * 0.55,
    fontWeight: '900',
  },
  markTextContainer: {
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: 24,
    borderWidth: 4,
    elevation: 10,
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    width: WIDTH,
  },
  resultText: {
    fontSize: 28,
    fontWeight: '800',
  },
  resultTextContainer: {
    alignItems: 'center',
    gap: 16,
    height: '100%',
    justifyContent: 'flex-start',
    paddingTop: 20,
    width: '100%',
  },
})
