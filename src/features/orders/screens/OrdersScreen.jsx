import { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useMarketplace } from '../../marketplace';
import { ConnectionStatus } from '../../marketplace/components/ConnectionStatus';
import { Feedback } from '../../../shared/components/Feedback';
import { colors } from '../../../shared/theme/theme';
import { OrderCard } from '../components/OrderCard';
import { StatusSheet } from '../components/StatusSheet';

export function OrdersScreen({ route }) {
  const {
    buyerOrders,
    sellerOrders,
    context,
    loading,
    error,
    refresh,
    changeOrderStatus,
  } = useMarketplace();
  const [sellerView, setSellerView] = useState(false);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const inFlight = useRef(false);
  const isSeller =
    Number(context?.summary?.total_products) > 0 || sellerOrders.length > 0;
  const orders = sellerView ? sellerOrders : buyerOrders;
  const reload = () => refresh().catch(() => {});

  async function update(status) {
    if (inFlight.current || !selected) return;
    inFlight.current = true;
    setBusy(true);
    setUpdateError('');
    try {
      await changeOrderStatus(selected.name, status);
      setSelected(null);
    } catch (failure) {
      setUpdateError(failure.message);
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            sellerView={sellerView}
            busy={busy && selected?.name === item.name}
            onUpdate={() => {
              setSelected(item);
              setUpdateError('');
            }}
          />
        )}
        refreshing={loading}
        onRefresh={reload}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>
              {sellerView ? 'Seller inbox' : 'Your orders'}
            </Text>
            <Text style={styles.subtitle}>
              {sellerView
                ? 'New orders and updates, in one place.'
                : 'Follow your orders, every step of the way.'}
            </Text>
            <ConnectionStatus />
            {!!route.params?.placedOrder && (
              <Text accessibilityLiveRegion="polite" style={styles.success}>
                Order {route.params.placedOrder} placed successfully.
              </Text>
            )}
            {isSeller && (
              <View style={styles.tabs}>
                {[
                  { label: 'My purchases', seller: false },
                  { label: 'Seller inbox', seller: true },
                ].map(item => (
                  <Pressable
                    key={item.label}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: sellerView === item.seller,
                    }}
                    onPress={() => setSellerView(item.seller)}
                    style={[
                      styles.tab,
                      sellerView === item.seller && styles.activeTab,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        sellerView === item.seller && styles.activeText,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
            {!!error && !!orders.length && (
              <Feedback
                title="Could not refresh orders"
                message={error}
                retry={reload}
              />
            )}
          </View>
        }
        ListEmptyComponent={
          <Feedback
            title={
              loading
                ? 'Loading orders...'
                : error
                ? 'Could not load orders'
                : 'No orders yet'
            }
            message={
              loading
                ? ''
                : error ||
                  (sellerView
                    ? 'New orders from buyers will appear here.'
                    : 'Place your first order from Home.')
            }
            loading={loading}
            retry={!loading ? reload : undefined}
          />
        }
      />
      {!!selected && (
        <StatusSheet
          order={selected}
          onClose={() => setSelected(null)}
          onSelect={update}
          busy={busy}
          error={updateError}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, flexGrow: 1 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
  },
  subtitle: { fontSize: 13, color: colors.muted, lineHeight: 20, marginTop: 8 },
  success: {
    padding: 14,
    marginBottom: 14,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    color: colors.accent,
    fontSize: 13,
    lineHeight: 20,
  },
  tabs: { flexDirection: 'row', gap: 8, marginVertical: 16 },
  tab: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  activeTab: { backgroundColor: colors.accent },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  activeText: { color: colors.surface },
});
