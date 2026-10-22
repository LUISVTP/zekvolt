// ─── src/hooks/useTheme.ts ────────────────────────────────────────────
// Hook para sistema de temas (dark/light)

import { useContext } from 'react';
import { ThemeContext } from '@/styles/theme';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
}