import { StyleSheet, Text, View } from 'react-native';
import { Package } from '../../../shared/components/icons';
import { Button } from '../../../shared/components/Button';
import { colors } from '../../../shared/theme/theme';
import { formatMoney } from '../../../shared/utils/formatters';

export function ProductCard({ product, ownProduct, onOrder }) {
  return (
    <View style={styles.card}>
      <View style={styles.visual}>
        <Package size={46} color={colors.accent} strokeWidth={1.2} />
        <Text style={styles.category}>{product.category || 'PRODUCT'}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>
          {product.product_name}
        </Text>
        <Text style={styles.seller} numberOfLines={1}>
          {product.seller}
        </Text>
        <Text style={styles.stock}>
          {product.stock_qty} {product.unit || 'units'} available
        </Text>
        <Text style={styles.price}>
          {formatMoney(product.selling_price)}
          <Text style={styles.unit}> / {product.unit || 'unit'}</Text>
        </Text>
        <Button
          title={ownProduct ? 'Your product' : 'Order'}
          disabled={ownProduct}
          onPress={onOrder}
          accessibilityLabel={`Order ${product.product_name}`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: '50%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  visual: {
    aspectRatio: 1.25,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  category: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  details: { padding: 12, gap: 9 },
  name: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.text,
    minHeight: 40,
  },
  seller: { fontSize: 10, color: colors.muted },
  stock: { fontSize: 11, color: colors.accent },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginVertical: 3,
  },
  unit: { fontSize: 10, fontWeight: '400', color: colors.muted },
});
