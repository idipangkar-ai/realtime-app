import { ArrowLeft, Menu, MessageCircle, Search } from './icons';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from './IconButton';
import { colors } from '../theme/theme';

export function AppHeader({ navigation, title, onMenu, canGoBack = false }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <IconButton
          icon={canGoBack ? ArrowLeft : Menu}
          label={canGoBack ? 'Go back' : 'Open menu'}
          onPress={canGoBack ? () => navigation.goBack() : onMenu}
        />
        <View style={styles.brand}>
          <Text accessibilityRole="header" style={styles.title}>
            {title || 'realtime'}
            <Text style={styles.dot}>{title ? '' : '.'}</Text>
          </Text>
        </View>
        {!canGoBack && (
          <View style={styles.actions}>
            <IconButton
              icon={Search}
              label="Open search"
              onPress={() => navigation.navigate('Search')}
            />
            <IconButton
              icon={MessageCircle}
              label="Open chat"
              onPress={() => navigation.navigate('Chat')}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  brand: { flex: 1, paddingLeft: 8 },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1,
  },
  dot: { color: colors.accent },
  actions: { flexDirection: 'row', gap: 4 },
});
