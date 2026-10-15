import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../shared/components/Button';
import { colors } from '../../../shared/theme/theme';
import { formatDate, formatMoney } from '../../../shared/utils/formatters';
import { closedStatuses } from '../config/statuses';

export function OrderCard({ order, sellerView, onUpdate, busy }) {
  const cancelled = order.order_status === 'Cancelled';
  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <Text selectable style={styles.id}>
          {order.name}
        </Text>
        <View style={[styles.badge, cancelled && styles.cancelled]}>
          <Text style={[styles.status, cancelled && styles.cancelledText]}>
            {order.order_status}
          </Text>
        </View>
      </View>
      <Text style={styles.product}>{order.product_name || order.product}</Text>
      <Text style={styles.detail}>
        {order.quantity} × {formatMoney(order.unit_price)}
      </Text>
      <Text style={styles.detail}>
        {sellerView ? 'Buyer' : 'Seller'}:{' '}
        {sellerView ? order.buyer : order.seller}
      </Text>
      <View style={styles.totalRow}>
        <Text style={styles.detail}>Payment: {order.payment_status}</Text>
        <Text style={styles.total}>{formatMoney(order.total_amount)}</Text>
      </View>
      <Text style={styles.date}>Updated {formatDate(order.modified)}</Text>
      {sellerView && !closedStatuses.has(order.order_status) && (
        <Button title="Update status" onPress={onUpdate} busy={busy} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 17,
    gap: 10,
    marginBottom: 14,
  },
  heading: { gap: 10, alignItems: 'flex-start' },
  id: { fontSize: 11, color: colors.muted },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.accentSoft,
    borderRadius: 8,
  },
  status: { color: colors.accent, fontSize: 12, fontWeight: '700' },
  cancelled: { backgroundColor: '#FAEAE6' },
  cancelledText: { color: '#A33932' },
  product: { fontSize: 17, fontWeight: '700', color: colors.text },
  detail: { fontSize: 12, color: colors.muted, lineHeight: 18 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: { fontSize: 20, fontWeight: '800', color: colors.text },
  date: { fontSize: 10, color: colors.muted },
});
