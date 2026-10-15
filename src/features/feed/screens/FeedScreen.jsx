import { useRef, useState } from 'react';
import { useScrollToTop } from '@react-navigation/native';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ProductCard } from '../components/ProductCard';
import { categories, products } from '../data/products';
import { colors } from '../../../shared/theme/theme';

export function FeedScreen() {
  const [category, setCategory] = useState('All finds');
  const listRef = useRef(null);
  useScrollToTop(listRef);
  const filtered =
    category === 'All finds'
      ? products
      : products.filter(product => product.category === category);

  return (
    <FlatList
      ref={listRef}
      data={filtered}
      numColumns={2}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <ProductCard product={item} />}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          <View style={styles.intro}>
            <View style={styles.eyebrowRow}>
              <View style={styles.dot} />
              <Text style={styles.eyebrow}>THE EVERYDAY EDIT</Text>
            </View>
            <Text accessibilityRole="header" style={styles.title}>
              Good finds.{'\n'}Great everyday.
            </Text>
            <Text style={styles.subtitle}>
              A few things we think you'll love.
            </Text>
          </View>
          <View style={styles.categories}>
            {categories.map(item => (
              <Pressable
                key={item}
                accessibilityRole="button"
                accessibilityState={{ selected: item === category }}
                onPress={() => setCategory(item)}
                style={[styles.chip, item === category && styles.activeChip]}
              >
                <Text
                  style={[
                    styles.chipText,
                    item === category && styles.activeChipText,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Picked for you</Text>
            <Text style={styles.count}>{filtered.length} finds</Text>
          </View>
        </View>
      }
      ListFooterComponent={
        <Text style={styles.footer}>
          A little inspiration for your everyday.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingTop: 26, backgroundColor: colors.background },
  row: { gap: 12, marginBottom: 14 },
  intro: { paddingHorizontal: 4 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.accent,
  },
  title: {
    fontSize: 34,
    lineHeight: 39,
    fontWeight: '800',
    letterSpacing: -1.5,
    color: colors.text,
    marginTop: 13,
  },
  subtitle: { color: colors.muted, fontSize: 13, marginTop: 10 },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 24,
    marginBottom: 25,
  },
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
    paddingHorizontal: 4,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  count: { color: colors.muted, fontSize: 11 },
  footer: {
    color: colors.muted,
    fontSize: 11,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
