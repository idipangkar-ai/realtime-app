import { SafeAreaProvider } from 'react-native-safe-area-context';

export function AppProviders({ children }) {
  return <SafeAreaProvider>{children}</SafeAreaProvider>;
}
