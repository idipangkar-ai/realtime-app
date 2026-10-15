import { StyleSheet, View } from 'react-native';

// Screens apply their own insets to support edge-to-edge layouts and avoid
// applying safe-area padding twice.
export function Screen({ children, style, ...props }) {
  return (
    <View {...props} style={[styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
