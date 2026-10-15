import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthProvider';
import { Button } from '../../../shared/components/Button';
import { colors } from '../../../shared/theme/theme';

export function LoginScreen() {
  const { signIn, notice } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);
  const passwordRef = useRef(null);

  async function submit() {
    if (submitting.current) return;
    if (!username.trim() || !password) {
      setError('Enter your email or username and password.');
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError('');
    try {
      await signIn(username, password);
      setPassword('');
    } catch (failure) {
      setError(failure.message);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <Text style={styles.brand}>realtime.</Text>
          <View style={styles.form}>
            <Text style={styles.label}>Email or username</Text>
            <TextInput
              accessibilityLabel="Email or username"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              textContentType="username"
              value={username}
              onChangeText={setUsername}
              editable={!busy}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              placeholder="Your Frappe account"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              ref={passwordRef}
              accessibilityLabel="Password"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="current-password"
              textContentType="password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!busy}
              returnKeyType="go"
              onSubmitEditing={submit}
              placeholder="Your password"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
            {!!(error || notice) && (
              <Text accessibilityRole="alert" style={styles.error}>
                {error || notice}
              </Text>
            )}
            <Button title="Sign in" busy={busy} onPress={submit} />
          </View>
          <Text style={styles.footer}>
            Use your existing Frappe account.{'\n'}Your mobile and web sessions
            stay separate.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  fill: { flex: 1 },
  content: {
    flexGrow: 1,
    padding: 28,
    paddingTop: 48,
    justifyContent: 'center',
    gap: 34,
  },
  brand: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1.5,
    color: colors.accent,
  },
  intro: { gap: 12 },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 1.6,
    fontWeight: '700',
    color: colors.accent,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.text,
  },
  subtitle: { fontSize: 14, lineHeight: 22, color: colors.muted },
  form: { gap: 12 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text },
  input: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: 15,
    fontSize: 15,
  },
  error: { color: '#A33932', fontSize: 13, lineHeight: 20 },
  footer: {
    fontSize: 12,
    lineHeight: 20,
    color: colors.muted,
    textAlign: 'center',
  },
});
