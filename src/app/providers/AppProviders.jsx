import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../../features/auth';
import { MarketplaceProvider } from '../../features/marketplace';

export function AppProviders({ children }) {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MarketplaceProvider>{children}</MarketplaceProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
