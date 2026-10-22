// ─── App.tsx ─────────────────────────────────────────────────────────────
// Punto de entrada principal de la aplicación Zekvolt

import React from 'react';
import { ThemeProvider } from '@/styles/theme';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}