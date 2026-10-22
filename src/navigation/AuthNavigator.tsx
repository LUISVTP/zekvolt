// ─── src/navigation/AuthNavigator.tsx ────────────────────────────────────
// Navegador de autenticación (Login, Register, Setup)

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import SetupScreen from '@/screens/auth/SetupScreen';
import SplashScreen from '@/screens/auth/SplashScreen';

type AuthStackParams = {
  Login: undefined;
  Register: undefined;
  Setup: undefined;
  Splash: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParams>();

function SplashRoute({ navigation }: NativeStackScreenProps<AuthStackParams, 'Splash'>) {
  return <SplashScreen onDone={() => navigation.replace('Login')} />;
}

interface AuthNavigatorProps {
  initialRouteName?: 'Splash' | 'Login' | 'Setup';
  userId?: string;
  onSetupComplete?: (userId: string) => void;
}

export function AuthNavigator({ initialRouteName = 'Splash', userId, onSetupComplete }: AuthNavigatorProps) {
  return (
    <AuthStack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Splash" component={SplashRoute} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen
        name="Setup"
        component={(props: NativeStackScreenProps<AuthStackParams, 'Setup'>) => (
          <SetupScreen {...props} userId={userId} onSetupComplete={onSetupComplete} />
        )}
      />
    </AuthStack.Navigator>
  );
}

export default AuthNavigator;