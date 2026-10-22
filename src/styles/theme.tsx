// ─── src/styles/theme.tsx ──────────────────────────────────────────────
// Sistema de temas con Context API

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';

export interface ThemeColors {
  bg: string;
  surface: string;
  card: string;
  border: string;
  cyan: string;
  cyanDim: string;
  cyanMid: string;
  gold: string;
  goldDim: string;
  orange: string;
  text: string;
  textMuted: string;
  textSub: string;
  red: string;
  redDim: string;
  redMid: string;
  green: string;
  white: string;
  overlay: string;
}

const makeTheme = (dark: boolean): ThemeColors => ({
  bg: dark ? '#0a0c0e' : '#f0f4f4',
  surface: dark ? '#111518' : '#e2eceb',
  card: dark ? '#161b20' : '#ffffff',
  border: dark ? '#1e262e' : '#c5d8d6',
  cyan: '#00d4c8',
  cyanDim: dark ? '#00d4c822' : '#00d4c818',
  cyanMid: dark ? '#00d4c855' : '#00d4c866',
  gold: '#f5a623',
  goldDim: dark ? '#f5a62322' : '#f5a62318',
  orange: '#f5a623',
  text: dark ? '#e8f4f3' : '#0d2a28',
  textMuted: dark ? '#6b8a88' : '#3d6a68',
  textSub: dark ? '#3d5a58' : '#8ab0ae',
  red: '#ff4757',
  redDim: dark ? '#ff475722' : '#ff475718',
  redMid: dark ? '#ff475766' : '#ff475766',
  green: '#2ed573',
  white: '#ffffff',
  overlay: dark ? '#00000088' : '#00000044',
});

interface ThemeContextValue {
  dark: boolean;
  theme: ThemeColors;
  toggle: () => void;
  setDark: (dark: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDarkState] = useState(true);

  const theme = useMemo(() => makeTheme(dark), [dark]);

  const toggle = useCallback(() => setDarkState(d => !d), []);
  const setDark = useCallback((value: boolean) => setDarkState(value), []);

  const value = useMemo(() => ({ dark, theme, toggle, setDark }), [dark, toggle, setDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
}

// Exportar tema estático para uso fuera de componentes (ej: StyleSheet)
export const staticTheme = makeTheme(true);
export const staticLightTheme = makeTheme(false);