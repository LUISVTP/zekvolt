// ─── src/styles/theme.tsx ──────────────────────────────────────────────
// Sistema de temas con Context API: modo oscuro/claro, alto contraste y
// escala de texto para accesibilidad.

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export type FontScale = 1 | 1.2 | 1.4;

export const FONT_SCALE_OPTIONS: { value: FontScale; label: string }[] = [
  { value: 1, label: 'Normal' },
  { value: 1.2, label: 'Grande' },
  { value: 1.4, label: 'Extra grande' },
];

const STORAGE_KEYS = {
  dark: 'zekvolt/theme/dark',
  highContrast: 'zekvolt/theme/highContrast',
  fontScale: 'zekvolt/theme/fontScale',
};

const baseTheme = (dark: boolean): ThemeColors => ({
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

/**
 * Tema de alto contraste: fondos casi puros, texto con contraste WCAG AA/AAA
 * y bordes visibles. Mantiene la identidad cian/dorado de Zekvolt.
 */
const highContrastTheme = (dark: boolean): ThemeColors =>
  dark
    ? {
        bg: '#000000',
        surface: '#0b0f12',
        card: '#12181d',
        border: '#8ba3a1',
        cyan: '#00fff2',
        cyanDim: '#003c39',
        cyanMid: '#00fff2',
        gold: '#ffc14d',
        goldDim: '#3d2a00',
        orange: '#ffc14d',
        text: '#ffffff',
        textMuted: '#d3e3e1',
        textSub: '#aec6c4',
        red: '#ff8490',
        redDim: '#3d0d12',
        redMid: '#ff8490',
        green: '#66ffb0',
        white: '#ffffff',
        overlay: '#000000cc',
      }
    : {
        bg: '#ffffff',
        surface: '#f4f4f4',
        card: '#ffffff',
        border: '#1f1f1f',
        cyan: '#00615c',
        cyanDim: '#d6efec',
        cyanMid: '#00615c',
        gold: '#7a4a00',
        goldDim: '#f3e3c2',
        orange: '#7a4a00',
        text: '#000000',
        textMuted: '#1f1f1f',
        textSub: '#333333',
        red: '#a10012',
        redDim: '#f7d6d9',
        redMid: '#a10012',
        green: '#005c2b',
        white: '#ffffff',
        overlay: '#00000066',
      };

const makeTheme = (dark: boolean, highContrast: boolean): ThemeColors =>
  highContrast ? highContrastTheme(dark) : baseTheme(dark);

interface ThemeContextValue {
  dark: boolean;
  theme: ThemeColors;
  toggle: () => void;
  setDark: (dark: boolean) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  fontScale: FontScale;
  setFontScale: (value: FontScale) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDarkState] = useState(true);
  const [highContrast, setHighContrastState] = useState(false);
  const [fontScale, setFontScaleState] = useState<FontScale>(1);

  // Restaurar preferencias guardadas
  useEffect(() => {
    let mounted = true;
    AsyncStorage.multiGet([STORAGE_KEYS.dark, STORAGE_KEYS.highContrast, STORAGE_KEYS.fontScale])
      .then(entries => {
        if (!mounted) return;
        const stored = Object.fromEntries(entries);
        if (stored[STORAGE_KEYS.dark] === 'light') setDarkState(false);
        if (stored[STORAGE_KEYS.highContrast] === 'true') setHighContrastState(true);
        const storedScale = Number(stored[STORAGE_KEYS.fontScale]);
        if (storedScale === 1.2 || storedScale === 1.4) setFontScaleState(storedScale);
      })
      .catch(() => {
        // Sin preferencias guardadas: se usan los valores por defecto
      });
    return () => {
      mounted = false;
    };
  }, []);

  const theme = useMemo(() => makeTheme(dark, highContrast), [dark, highContrast]);

  const toggle = useCallback(() => {
    setDarkState(previous => {
      const next = !previous;
      AsyncStorage.setItem(STORAGE_KEYS.dark, next ? 'dark' : 'light').catch(() => {});
      return next;
    });
  }, []);

  const setDark = useCallback((value: boolean) => {
    setDarkState(value);
    AsyncStorage.setItem(STORAGE_KEYS.dark, value ? 'dark' : 'light').catch(() => {});
  }, []);

  const setHighContrast = useCallback((value: boolean) => {
    setHighContrastState(value);
    AsyncStorage.setItem(STORAGE_KEYS.highContrast, String(value)).catch(() => {});
  }, []);

  const setFontScale = useCallback((value: FontScale) => {
    setFontScaleState(value);
    AsyncStorage.setItem(STORAGE_KEYS.fontScale, String(value)).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({
      dark,
      theme,
      toggle,
      setDark,
      highContrast,
      setHighContrast,
      fontScale,
      setFontScale,
    }),
    [dark, theme, toggle, setDark, highContrast, setHighContrast, fontScale, setFontScale]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
}

// Exportar tema estático para uso fuera de componentes (ej: StyleSheet)
export const staticTheme = baseTheme(true);
export const staticLightTheme = baseTheme(false);
