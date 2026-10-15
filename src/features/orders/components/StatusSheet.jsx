import { Alert, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../shared/components/Button';
import { colors } from '../../../shared/theme/theme';
import { orderStatuses } from '../config/statuses';

export function StatusSheet({ order, onClose, onSelect, busy, error }) {
  function choose(status) {
    if (status === 'Cancelled') {
      Alert.alert(
        'Cancel this order?',
        'This closes the order and notifies the buyer.',
        [
          { text: 'Keep order', style: 'cancel' },
          {
            text: 'Cancel order',
            style: 'destructive',
            onPress: () => onSelect(status),
          },
        ],
      );
    } else {
      onSelect(status);
    }
  }
  return (
    <Modal
      transparent
      animationType="slide"
      onRequestClose={() => {
        if (!busy) onClose();
      }}
    >
      <View style={styles.overlay}>
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Update order status</Text>
            <Text style={styles.subtitle}>
              {order.name} · {order.order_status}
            </Text>
            {!!error && (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            )}
            {orderStatuses
              .filter(status => status !== order.order_status)
              .map(status => (
                <Button
                  key={status}
                  title={status}
                  secondary
                  disabled={busy}
                  onPress={() => choose(status)}
                />
              ))}
            <Button
              title={busy ? 'Updating...' : 'Close'}
              disabled={busy}
              onPress={onClose}
            />
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#15201566',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  content: { padding: 24, gap: 12 },
  title: { fontSize: 23, fontWeight: '800', color: colors.text },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
    marginBottom: 8,
  },
  error: { fontSize: 13, color: '#A33932', lineHeight: 20 },
});
