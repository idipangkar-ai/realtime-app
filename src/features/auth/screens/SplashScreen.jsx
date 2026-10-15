import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthProvider';
import { Button } from '../../../shared/components/Button';
import { colors } from '../../../shared/theme/theme';

export function SplashScreen() {
  const { bootError, retry, signOut } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.brand}>
        <Text style={styles.logo}>realtime.</Text>
        <Text style={styles.tagline}>Your everyday marketplace.</Text>
      </View>
      {bootError ? (
        <View style={styles.feedback}>
          <Text style={styles.error}>{bootError}</Text>
          <Button title="Retry connection" onPress={retry} />
          <Button
            title="Use another account"
            secondary
            onPress={() => signOut().catch(() => {})}
          />
        </View>
      ) : (
        <View style={styles.feedback}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.tagline}>Restoring your session...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 32,
    gap: 48,
  },
  brand: { alignItems: 'center', gap: 8 },
  logo: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -2,
    color: colors.accent,
  },
  tagline: { fontSize: 14, color: colors.muted, textAlign: 'center' },
  feedback: { gap: 16 },
  error: {
    fontSize: 14,
    lineHeight: 21,
    color: '#A33932',
    textAlign: 'center',
  },
});
