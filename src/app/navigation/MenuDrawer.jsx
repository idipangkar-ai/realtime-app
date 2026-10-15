import {
  Home,
  UserRound,
  Package,
  Grid2X2,
  X,
  ArrowUpRight,
} from '../../shared/components/icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '../../shared/components/IconButton';
import { colors } from '../../shared/theme/theme';

const items = [
  { name: 'Home', icon: Home },
  { name: 'Profile', icon: UserRound },
  { name: 'Orders', icon: Package },
  { name: 'More', icon: Grid2X2 },
];

export function MenuDrawer({ visible, onClose, navigation }) {
  const insets = useSafeAreaInsets();

  function openTab(name) {
    onClose();
    navigation.navigate(name);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close menu backdrop"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.drawer,
            { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 },
          ]}
        >
          <View style={styles.heading}>
            <Text style={styles.brand}>realtime.</Text>
            <IconButton icon={X} label="Close menu" onPress={onClose} />
          </View>
          <Text style={styles.caption}>MAKE EVERYDAY A LITTLE BETTER</Text>
          <View style={styles.links}>
            {items.map(({ name, icon: Icon }) => (
              <Pressable
                key={name}
                accessibilityRole="button"
                accessibilityLabel={`Menu ${name}`}
                onPress={() => openTab(name)}
                style={styles.link}
              >
                <Icon size={22} strokeWidth={1.6} color={colors.accent} />
                <Text style={styles.label}>{name}</Text>
                <ArrowUpRight size={16} color={colors.muted} />
              </Pressable>
            ))}
          </View>
          <Text style={styles.footer}>A space for good finds.</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#15201566' },
  drawer: {
    width: '84%',
    maxWidth: 360,
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 22,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.text,
  },
  caption: {
    fontSize: 8,
    letterSpacing: 1.2,
    color: colors.muted,
    marginTop: 8,
  },
  links: { marginTop: 40, gap: 6 },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.text },
  footer: { marginTop: 'auto', color: colors.muted, fontSize: 12 },
});
