// ─── src/screens/main/SettingsScreen.tsx ────────────────────────────────────
// Pantalla de ajustes

import React from 'react';
import { useTheme } from '@/styles/theme';
import { SettingsForm } from '@/components/settings';
import { ZekvoltLogo } from '@/components/logo/ZekvoltLogo';
import type { Profile } from '@/types';

interface SettingsScreenProps {
  profile: Profile;
  userEmail: string;
  onLogout: () => void;
  onUpdateProfile: (profile: Profile) => void;
}

export default function SettingsScreen({ profile, userEmail, onLogout, onUpdateProfile }: SettingsScreenProps) {
  const { theme, dark: darkMode, toggle: onToggleTheme } = useTheme();

  const handleSaveProfile = async (data: { city: string; estrato: number; company: string }) => {
    // La actualización real se hace en el componente SettingsForm
    // Aquí solo propagamos el callback
    onUpdateProfile({ ...profile, ...data });
  };

  const handleChangePassword = async (newPassword: string) => {
    // Implementar cambio de contraseña real
    // Por ahora solo simulamos
    return Promise.resolve();
  };

  return (
    <SettingsForm
      profile={profile}
      userEmail={userEmail}
      darkMode={darkMode}
      onToggleTheme={onToggleTheme}
      onSaveProfile={handleSaveProfile}
      onChangePassword={handleChangePassword}
      onLogout={onLogout}
    />
  );
}