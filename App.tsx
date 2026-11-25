// ─── App.tsx ─────────────────────────────────────────────────────────────
// Punto de entrada principal de la aplicación Zekvolt

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/styles/theme';
import { AppAlertHost } from '@/components/ui/AppAlert';
import { TutorialProvider } from '@/components/tutorial/TutorialOverlay';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TutorialProvider>
          <RootNavigator />
          <AppAlertHost />
        </TutorialProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
