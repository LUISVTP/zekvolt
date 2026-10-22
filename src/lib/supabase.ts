// ─── src/lib/supabase.ts ─────────────────────────────────────────────
// Cliente de Supabase (singleton) para React Native / Expo

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/config/env';

let supabaseInstance: SupabaseClient | null = null;

/** Devuelve el cliente Supabase singleton (se crea en el primer uso). */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    if (!env.supabase.url || !env.supabase.anonKey) {
      throw new Error(
        'Faltan EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY. Copia .env.example a .env y configura tus valores.'
      );
    }
    supabaseInstance = createClient(env.supabase.url, env.supabase.anonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  }
  return supabaseInstance;
}