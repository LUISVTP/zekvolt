// ─── src/navigation/RootNavigator.tsx ─────────────────────────────────────
// Navegador raíz que maneja el estado de autenticación

import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from '@/styles/theme';
import { getSession, onAuthChange, signOut } from '@/services/auth.service';
import { getProfile } from '@/services/profile.service';
import { getAppliances } from '@/services/appliance.service';
import type { Profile, Appliance, Session } from '@/types';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

function RootNavigatorInner() {
  const { dark: darkMode } = useTheme();

  const [screen, setScreen] = useState<'splash' | 'auth' | 'main'>('splash');
  const [authInitial, setAuthInitial] = useState<'Login' | 'Setup'>('Login');
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [initializing, setInitializing] = useState(true);

  // Cargar sesión al iniciar
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data, error } = await getSession();
      if (!mounted) return;

      if (error) {
        console.error('Error getting session:', error);
      }

      if (data) {
        setSession(data);
        await loadUserData(data.user.id);
      }
      setInitializing(false);
    };

    init();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = onAuthChange(async (event, newSession) => {
      if (!mounted) return;
      setSession(newSession);

      if (event === 'SIGNED_IN' && newSession) {
        await loadUserData(newSession.user.id);
      }
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        setAppliances([]);
        setAuthInitial('Login');
        setScreen('auth');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = useCallback(async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await getProfile(userId);
      if (profileError) throw profileError;

      if (profileData) {
        setProfile(profileData);
        const { data: appData, error: appError } = await getAppliances(userId);
        if (appError) throw appError;
        setAppliances(appData || []);
        setScreen('main');
      } else {
        // Sin perfil: el usuario necesita completar el onboarding (Setup)
        setAuthInitial('Setup');
        setPendingUserId(userId);
        setScreen('auth');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setAuthInitial('Login');
      setScreen('auth');
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await signOut();
  }, []);

  const handleAddAppliance = useCallback(async (applianceData: { name: string; hours: number; qty: number }) => {
    if (!session?.user.id) return;
    await loadUserData(session.user.id);
  }, [session, loadUserData]);

  const handleRemoveAppliance = useCallback(async (applianceId: string) => {
    if (!session?.user.id) return;
    await loadUserData(session.user.id);
  }, [session, loadUserData]);

  const handleUpdateProfile = useCallback((newProfile: Profile) => {
    setProfile(newProfile);
  }, []);

  // ─── Render según estado ──────────────────────────────────────────────
  if (screen === 'splash') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0c0e' }}>
        {/* Splash se renderiza dentro del AuthNavigator */}
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      {screen === 'auth' ? (
        <AuthNavigator
          initialRouteName={authInitial}
          userId={pendingUserId ?? undefined}
          onSetupComplete={uid => loadUserData(uid)}
        />
      ) : (
        <>
          <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
          <MainTabNavigator
            userId={session?.user.id!}
            userEmail={session?.user.email!}
            profile={profile!}
            appliances={appliances}
            onAddAppliance={handleAddAppliance}
            onRemoveAppliance={handleRemoveAppliance}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
          />
        </>
      )}
    </NavigationContainer>
  );
}

export default function RootNavigator() {
  return <RootNavigatorInner />;
}