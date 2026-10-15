import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { colors } from '../theme/theme';

export function Feedback({ title, message, retry, loading = false }) {
  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color={colors.accent} />}
      <Text style={styles.title}>{title}</Text>
      {!!message && (
        <Text accessibilityLiveRegion="polite" style={styles.message}>
          {message}
        </Text>
      )}
      {!!retry && <Button title="Try again" onPress={retry} secondary />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 12, alignItems: 'center' },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
    textAlign: 'center',
  },
});
