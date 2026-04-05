import { Colors } from '@/constants/Colors'
import { BentoGrid, WelcomeHeader } from '@/features/home/components'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={Colors.gradients.homeBackground}
      style={styles.background}
    >
      <View pointerEvents="none" style={[styles.glow, styles.glowTop]} />
      <View pointerEvents="none" style={[styles.glow, styles.glowBottom]} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView style={styles.safeAreaView}>
          <WelcomeHeader levelName="軽いオタク" levelStars={2} />
          <BentoGrid />
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  glow: {
    borderRadius: 999,
    opacity: 0.65,
    position: 'absolute',
  },
  glowBottom: {
    backgroundColor: Colors.home.glowBottom,
    bottom: 72,
    height: 260,
    left: -110,
    width: 260,
  },
  glowTop: {
    backgroundColor: Colors.home.glowTop,
    height: 220,
    right: -60,
    top: -24,
    width: 220,
  },
  safeAreaView: {
    flex: 1,
    gap: 22,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
})
