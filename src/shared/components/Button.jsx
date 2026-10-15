import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/theme';

export function Button({
  title,
  onPress,
  busy = false,
  disabled = false,
  secondary = false,
  accessibilityLabel,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || busy, busy }}
      disabled={disabled || busy}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        (disabled || busy) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={secondary ? colors.accent : colors.surface} />
      ) : (
        <Text style={[styles.label, secondary && styles.secondaryLabel]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  secondary: { backgroundColor: colors.accentSoft },
  label: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryLabel: { color: colors.accent },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.75 },
});
