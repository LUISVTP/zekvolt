// ─── src/navigation/types.ts ────────────────────────────────────────────
// Tipos de navegación TypeScript

import type { AuthStackParamList, MainTabParamList, RootStackParamList } from '@/types';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}