import {
  Grid2X2,
  Home,
  Package,
  UserRound,
} from '../../shared/components/icons';
import { useState } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { FeedScreen } from '../../features/feed';
import { ProfileScreen } from '../../features/profile';
import { OrdersScreen } from '../../features/orders';
import { MoreScreen } from '../../features/more';
import { SearchScreen } from '../../features/search';
import { ChatScreen } from '../../features/chat';
import { AppHeader } from '../../shared/components/AppHeader';
import { colors } from '../../shared/theme/theme';
import { MenuDrawer } from './MenuDrawer';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};
const tabIcons = { Home, Profile: UserRound, Orders: Package, More: Grid2X2 };

function TabIcon({ name, color, focused }) {
  const Icon = tabIcons[name];
  return (
    <View style={[styles.icon, focused && styles.activeIcon]}>
      <Icon size={22} strokeWidth={focused ? 2 : 1.6} color={color} />
    </View>
  );
}

function TabHeader({ navigation, route }) {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <>
      <AppHeader
        navigation={navigation}
        title={route.name === 'Home' ? undefined : route.name}
        onMenu={() => setMenuVisible(true)}
      />
      <MenuDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
      />
    </>
  );
}

function renderTabHeader(props) {
  return <TabHeader {...props} />;
}

function tabOptions({ route }) {
  return {
    header: renderTabHeader,
    tabBarIcon: props => <TabIcon {...props} name={route.name} />,
    tabBarActiveTintColor: colors.accent,
    tabBarInactiveTintColor: colors.muted,
    tabBarLabelStyle: styles.tabLabel,
    tabBarStyle: styles.tabBar,
    tabBarItemStyle: styles.tabItem,
    tabBarAccessibilityLabel: `${route.name} tab`,
  };
}

function MainTabs() {
  return (
    <Tabs.Navigator screenOptions={tabOptions} backBehavior="history">
      <Tabs.Screen name="Home" component={FeedScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
      <Tabs.Screen name="Orders" component={OrdersScreen} />
      <Tabs.Screen name="More" component={MoreScreen} />
    </Tabs.Navigator>
  );
}

function renderStackHeader({ navigation, route }) {
  return <AppHeader navigation={navigation} title={route.name} canGoBack />;
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          header: renderStackHeader,
          contentStyle: styles.content,
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  content: { backgroundColor: colors.background },
  icon: {
    width: 48,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  activeIcon: { backgroundColor: colors.accentSoft },
  tabBar: { backgroundColor: colors.surface, borderTopColor: colors.border },
  tabItem: { paddingTop: 4 },
  tabLabel: { fontSize: 10, fontWeight: '600', marginTop: 2 },
});
