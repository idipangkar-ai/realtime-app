import { Star } from '../../../shared/components/icons';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/theme';

const formatPrice = value => `\u20B9${value.toLocaleString('en-IN')}`;

export function ProductCard({ product }) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={product.image}
          accessibilityLabel={product.name}
          style={styles.image}
        />
        {product.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.details}>
        <View style={styles.meta}>
          <Text style={styles.category}>{product.category.toUpperCase()}</Text>
          <View style={styles.rating}>
            <Star size={11} fill={colors.accent} color={colors.accent} />
            <Text style={styles.ratingText}>{product.rating}</Text>
          </View>
        </View>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
        <View style={styles.prices}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Text style={styles.originalPrice}>
            {formatPrice(product.originalPrice)}
          </Text>
        </View>
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
  imageContainer: { aspectRatio: 1, backgroundColor: '#EDEEE7' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FFFFFFEE',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 5,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: colors.text,
  },
  details: { padding: 12 },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  category: {
    fontSize: 9,
    letterSpacing: 1.1,
    color: colors.muted,
    fontWeight: '600',
  },
  rating: { flexDirection: 'row', gap: 3, alignItems: 'center' },
  ratingText: { fontSize: 10, fontWeight: '600', color: colors.text },
  name: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.text,
    minHeight: 40,
  },
  description: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.muted,
    marginTop: 5,
    minHeight: 32,
  },
  prices: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  price: { fontSize: 16, fontWeight: '800', color: colors.text },
  originalPrice: {
    fontSize: 11,
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
});
