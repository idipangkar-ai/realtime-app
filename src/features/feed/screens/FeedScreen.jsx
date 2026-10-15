import { useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ProductCard } from '../components/ProductCard';
import { OrderSheet } from '../components/OrderSheet';
import { useMarketplace } from '../../marketplace';
import { useAuth } from '../../auth';
import { ConnectionStatus } from '../../marketplace/components/ConnectionStatus';
import { Feedback } from '../../../shared/components/Feedback';
import { colors } from '../../../shared/theme/theme';

export function FeedScreen({ navigation }) {
  const { products, loading, error, refresh } = useMarketplace();
  const { user } = useAuth();
  const [category, setCategory] = useState('All products');
  const [selected, setSelected] = useState(null);
  const listRef = useRef(null);
  useScrollToTop(listRef);
  const categories = [
    'All products',
    ...new Set(products.map(product => product.category).filter(Boolean)),
  ];
  const activeCategory = categories.includes(category)
    ? category
    : 'All products';
  const filtered =
    activeCategory === 'All products'
      ? products
      : products.filter(product => product.category === activeCategory);
  const reload = () => refresh().catch(() => {});

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={filtered}
        numColumns={2}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            ownProduct={item.seller === user.name}
            onOrder={() => setSelected(item)}
          />
        )}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={reload}
        ListHeaderComponent={
          <View>
            <Text style={styles.eyebrow}>YOUR EVERYDAY MARKETPLACE</Text>
            <Text accessibilityRole="header" style={styles.title}>
              Fresh finds.{'\n'}Live from your sellers.
            </Text>
            <Text style={styles.subtitle}>
              Hello, {user.full_name || user.name}.
            </Text>
            <ConnectionStatus />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categories}
            >
              {categories.map(item => (
                <Pressable
                  key={item}
                  accessibilityRole="button"
                  accessibilityState={{ selected: item === activeCategory }}
                  onPress={() => setCategory(item)}
                  style={[
                    styles.chip,
                    item === activeCategory && styles.activeChip,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      item === activeCategory && styles.activeChipText,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available products</Text>
              <Text style={styles.count}>{filtered.length} products</Text>
            </View>
            {!!error && !!products.length && (
              <Feedback
                title="Could not refresh products"
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
                ? 'Loading products...'
                : error
                ? 'Could not load products'
                : 'No products available'
            }
            message={loading ? '' : error || 'Pull down to check again.'}
            loading={loading}
            retry={!loading ? reload : undefined}
          />
        }
      />
      {!!selected && (
        <OrderSheet
          product={selected}
          onClose={() => setSelected(null)}
          onOrdered={order => {
            setSelected(null);
            navigation.navigate('Orders', { placedOrder: order });
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 26, flexGrow: 1 },
  row: { gap: 12, marginBottom: 14 },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.accent,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -1.2,
    color: colors.text,
    marginTop: 13,
  },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 10 },
  categories: { gap: 8, paddingTop: 14, paddingBottom: 24 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 17,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  activeChip: { backgroundColor: colors.text, borderColor: colors.text },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.muted },
  activeChipText: { color: colors.surface },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  count: { color: colors.muted, fontSize: 11 },
});
