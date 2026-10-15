import { useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../shared/components/Button';
import { formatMoney } from '../../../shared/utils/formatters';
import { colors } from '../../../shared/theme/theme';
import { useMarketplace } from '../../marketplace';

export function OrderSheet({ product, onClose, onOrdered }) {
  const [quantity, setQuantity] = useState(
    String(Math.min(1, Number(product.stock_qty))),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);
  const { orderProduct } = useMarketplace();
  const amount = Number(quantity);
  const valid =
    Number.isFinite(amount) &&
    amount > 0 &&
    amount <= Number(product.stock_qty);

  async function submit() {
    if (!valid || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError('');
    try {
      const result = await orderProduct(product.name, amount);
      onOrdered(result.order);
    } catch (failure) {
      setError(
        `${failure.message} If the connection timed out, check Orders before submitting again.`,
      );
    } finally {
      inFlight.current = false;
      setBusy(false);
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
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityLabel="Close order"
          accessibilityRole="button"
          disabled={busy}
          onPress={onClose}
        />
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
          >
            <Text style={styles.eyebrow}>PLACE AN ORDER</Text>
            <Text style={styles.title}>{product.product_name}</Text>
            <Text style={styles.meta}>Seller: {product.seller}</Text>
            <Text style={styles.meta}>
              {formatMoney(product.selling_price)} / {product.unit || 'unit'} ·{' '}
              {product.stock_qty} available
            </Text>
            <Text style={styles.label}>
              Quantity ({product.unit || 'units'})
            </Text>
            <View style={styles.stepper}>
              <Button
                title="−"
                accessibilityLabel="Decrease quantity"
                secondary
                disabled={busy || amount <= 1}
                onPress={() => setQuantity(String(Math.max(1, amount - 1)))}
              />
              <TextInput
                accessibilityLabel="Order quantity"
                style={styles.input}
                keyboardType="decimal-pad"
                value={quantity}
                onChangeText={setQuantity}
                editable={!busy}
                selectTextOnFocus
              />
              <Button
                title="+"
                accessibilityLabel="Increase quantity"
                secondary
                disabled={busy || amount >= Number(product.stock_qty)}
                onPress={() =>
                  setQuantity(
                    String(
                      Math.min(
                        Number(product.stock_qty),
                        (Number.isFinite(amount) ? amount : 0) + 1,
                      ),
                    ),
                  )
                }
              />
            </View>
            {!valid && (
              <Text style={styles.error}>
                Enter a quantity greater than zero, up to {product.stock_qty}.
              </Text>
            )}
            <View style={styles.total}>
              <Text style={styles.label}>Total</Text>
              <Text style={styles.title}>
                {formatMoney(
                  valid ? amount * Number(product.selling_price) : 0,
                )}
              </Text>
            </View>
            {!!error && (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            )}
            <Button
              title="Place order"
              onPress={submit}
              disabled={!valid}
              busy={busy}
            />
            <Button
              title="Cancel"
              secondary
              onPress={onClose}
              disabled={busy}
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
    maxHeight: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: { padding: 24, gap: 16 },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2,
    color: colors.accent,
    fontWeight: '700',
  },
  title: { fontSize: 24, color: colors.text, fontWeight: '800' },
  meta: { fontSize: 13, lineHeight: 20, color: colors.muted },
  label: { color: colors.text, fontSize: 14, fontWeight: '600' },
  stepper: { flexDirection: 'row', gap: 12 },
  input: {
    flex: 1,
    textAlign: 'center',
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    fontSize: 18,
  },
  total: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  error: { color: '#A33932', fontSize: 13, lineHeight: 20 },
});
