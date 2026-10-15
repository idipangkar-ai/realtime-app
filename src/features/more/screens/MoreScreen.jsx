import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMarketplace } from '../../marketplace';
import { ConnectionStatus } from '../../marketplace/components/ConnectionStatus';
import { Button } from '../../../shared/components/Button';
import { colors } from '../../../shared/theme/theme';
import { frappeConfig } from '../../../config/frappe';

export function MoreScreen() {
  const { connectionError, error, reconnect, events } = useMarketplace();
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Connection & activity</Text>
      <Text style={styles.subtitle}>
        Check live order updates while you test mobile and web together.
      </Text>
      <View style={styles.card}>
        <ConnectionStatus />
        <Text style={styles.label}>Site: {frappeConfig.site}</Text>
        <Text selectable style={styles.label}>
          API: {frappeConfig.baseUrl}
        </Text>
        <Text selectable style={styles.label}>
          Realtime: {frappeConfig.realtimeUrl}
        </Text>
        {!!connectionError && (
          <Text accessibilityRole="alert" style={styles.error}>
            Realtime: {connectionError}
          </Text>
        )}
        {!!error && <Text style={styles.error}>Data: {error}</Text>}
        <Button title="Reconnect and refresh" secondary onPress={reconnect} />
      </View>
      <Text style={styles.heading}>Recent live events</Text>
      {!events.length && (
        <Text style={styles.label}>
          No events received in this session yet. Place an order as a buyer, or
          update its status from the seller account.
        </Text>
      )}
      {events.map((event, index) => (
        <View style={styles.card} key={`${event.receivedAt}-${index}`}>
          <Text style={styles.event}>
            {event.type === 'marketplace_new_order'
              ? 'New order'
              : 'Order status updated'}
          </Text>
          <Text selectable style={styles.label}>
            {event.order}
          </Text>
          <Text style={styles.label}>{event.status || event.product}</Text>
          <Text style={styles.time}>
            Received {new Date(event.receivedAt).toLocaleTimeString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 22,
    backgroundColor: colors.background,
    gap: 18,
    flexGrow: 1,
  },
  title: { fontSize: 25, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.muted, lineHeight: 21 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 17,
    borderRadius: 16,
    gap: 12,
  },
  heading: { fontSize: 18, fontWeight: '700', color: colors.text },
  label: { fontSize: 12, lineHeight: 20, color: colors.muted },
  event: { fontSize: 14, fontWeight: '700', color: colors.accent },
  time: { fontSize: 10, color: colors.muted },
  error: { fontSize: 13, lineHeight: 20, color: '#A33932' },
});
