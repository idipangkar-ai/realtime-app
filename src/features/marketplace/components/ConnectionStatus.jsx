import { StyleSheet, Text, View } from 'react-native';
import { useMarketplace } from '../context/MarketplaceProvider';
import { colors } from '../../../shared/theme/theme';

export function ConnectionStatus() {
  const { connection, events } = useMarketplace();
  const connected = connection === 'connected';
  const latest = events[0];
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <View style={styles.row}>
        <View style={[styles.dot, !connected && styles.disconnected]} />
        <Text style={styles.label}>
          {connected ? 'Live updates connected' : `Live updates: ${connection}`}
        </Text>
      </View>
      {!!latest && (
        <Text style={styles.event}>
          {latest.order}: {latest.status || 'New order received'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 5, paddingVertical: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent },
  disconnected: { backgroundColor: '#B88735' },
  label: { color: colors.muted, fontSize: 11 },
  event: { color: colors.accent, fontSize: 12, lineHeight: 18 },
});
