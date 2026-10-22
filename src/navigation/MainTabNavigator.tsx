// ─── src/navigation/MainTabNavigator.tsx ─────────────────────────────────
// Navegador principal con bottom tabs

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/styles/theme';
import Icon, { type IconName } from '@/components/icons/Icon';
import HomeScreen from '@/screens/main/HomeScreen';
import AppliancesScreen from '@/screens/main/AppliancesScreen';
import ScanScreen from '@/screens/main/ScanScreen';
import MeterScreen from '@/screens/main/MeterScreen';
import SettingsScreen from '@/screens/main/SettingsScreen';

type MainTabParamList = {
  Home: undefined;
  Appliances: undefined;
  Scan: undefined;
  Meter: undefined;
  Settings: undefined;
};

const MainTab = createBottomTabNavigator<MainTabParamList>();

interface MainTabNavigatorProps {
  userId: string;
  userEmail: string;
  profile: any;
  appliances: any[];
  onAddAppliance: (data: { name: string; hours: number; qty: number }) => Promise<void>;
  onRemoveAppliance: (id: string) => Promise<void>;
  onLogout: () => void;
  onUpdateProfile: (profile: any) => void;
}

export function MainTabNavigator({
  userId,
  userEmail,
  profile,
  appliances,
  onAddAppliance,
  onRemoveAppliance,
  onLogout,
  onUpdateProfile,
}: MainTabNavigatorProps) {
  const { theme, dark: darkMode } = useTheme();

  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.cyan,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          paddingBottom: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600' as const,
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, IconName> = {
            Home: 'activity',
            Appliances: 'grid',
            Scan: 'camera',
            Meter: 'zap',
            Settings: 'settings',
          };
          return <Icon name={icons[route.name] ?? 'activity'} size={focused ? 24 : 22} color={color} />;
        },
      })}
    >
      <MainTab.Screen
        name="Home"
        component={() => <HomeScreen profile={profile} appliances={appliances} />}
      />
      <MainTab.Screen
        name="Appliances"
        component={() => <AppliancesScreen profile={profile} appliances={appliances} onAddAppliance={onAddAppliance} onRemoveAppliance={onRemoveAppliance} />}
      />
      <MainTab.Screen
        name="Scan"
        component={() => <ScanScreen profile={profile} onAddAppliance={onAddAppliance} />}
      />
      <MainTab.Screen
        name="Meter"
        component={() => <MeterScreen profile={profile} appliances={appliances} />}
      />
      <MainTab.Screen
        name="Settings"
        component={() => <SettingsScreen profile={profile} userEmail={userEmail} onLogout={onLogout} onUpdateProfile={onUpdateProfile} />}
      />
    </MainTab.Navigator>
  );
}

export default MainTabNavigator;