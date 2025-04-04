import { LevelDisplay } from '@/components/LevelDisplay'
import { PrimaryButton } from '@/components/ui/button/PrimaryButton'
import { SecondaryButton } from '@/components/ui/button/SecondaryButton'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.firstTextContainer}>
          <ThemedText type="subtitle">オタ力バトルしよう！</ThemedText>
        </View>
        <LevelDisplay />
        <PrimaryButton onPress={() => router.navigate('/questions')}>問題を解く</PrimaryButton>
        <SecondaryButton>問題を作成する</SecondaryButton>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  firstTextContainer: {
    alignItems: 'center',
    borderRadius: 10,
  },
  safeAreaView: {
    flex: 1,
    gap: 16,
  },
})
