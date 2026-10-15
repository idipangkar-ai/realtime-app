import { useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../../auth';
import { useMarketplace } from '../../marketplace';
import { Button } from '../../../shared/components/Button';
import { ConnectionStatus } from '../../marketplace/components/ConnectionStatus';
import { colors } from '../../../shared/theme/theme';

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { context, loading, error, refresh } = useMarketplace();
  const [busy, setBusy] = useState(false);
  const profile = context?.user || user;
  const summary = context?.summary || {};
  const roles = (profile.roles || []).filter(
    role => !['All', 'Guest'].includes(role),
  );

  function confirmSignOut() {
    Alert.alert(
      'Sign out?',
      'This signs out this phone. Your web session stays separate.',
      [
        { text: 'Stay signed in', style: 'cancel' },
        {
          text: 'Sign out',
          onPress: async () => {
            setBusy(true);
            try {
              await signOut();
            } catch {
              /* Local credentials are still cleared on network failure. */
            } finally {
              setBusy(false);
            }
          },
        },
      ],
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => refresh().catch(() => {})}
        />
      }
    >
      <View style={styles.avatar}>
        <Text style={styles.initial}>
          {(profile.full_name || profile.name).charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.name}>{profile.full_name || profile.name}</Text>
      <Text style={styles.email}>{profile.email || profile.name}</Text>
      <ConnectionStatus />
      <View style={styles.card}>
        <Text style={styles.heading}>Your Frappe account</Text>
        <Text style={styles.label}>Username</Text>
        <Text selectable style={styles.value}>
          {profile.name}
        </Text>
        <Text style={styles.label}>Account type</Text>
        <Text style={styles.value}>{profile.user_type}</Text>
        <Text style={styles.label}>Roles</Text>
        <Text style={styles.value}>
          {roles.join(', ') || 'Marketplace member'}
        </Text>
      </View>
      <View style={styles.stats}>
        {[
          { label: 'Orders', value: summary.total_orders },
          { label: 'Pending', value: summary.pending_orders },
          { label: 'Your products', value: summary.total_products },
        ].map(item => (
          <View key={item.label} style={styles.stat}>
            <Text style={styles.number}>{item.value ?? '—'}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button title="Sign out" secondary busy={busy} onPress={confirmSignOut} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 16,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 26,
    backgroundColor: colors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: { fontSize: 32, color: colors.accent, fontWeight: '800' },
  name: { color: colors.text, fontSize: 27, fontWeight: '800' },
  email: { color: colors.muted, fontSize: 14 },
  card: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  heading: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  label: { color: colors.muted, fontSize: 11 },
  value: { color: colors.text, fontSize: 14, lineHeight: 21, marginBottom: 6 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 14,
    gap: 6,
    borderRadius: 12,
  },
  number: { color: colors.accent, fontSize: 23, fontWeight: '800' },
  error: { color: '#A33932', fontSize: 13 },
});
