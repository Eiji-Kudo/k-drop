import { Colors } from '@/constants/Colors'
import { BentoGrid, WelcomeHeader } from '@/features/home/components'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <SafeAreaView style={styles.safeAreaView}>
        <WelcomeHeader levelName="軽いオタク" levelStars={2} />
        <BentoGrid />
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  safeAreaView: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
})
