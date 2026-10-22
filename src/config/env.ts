// ─── src/config/env.ts ────────────────────────────────────────────────
// Carga de variables de entorno (sin throw al importar)
// Copia .env.example a .env y llena tus valores

import { AppConfig } from '@/types';

function getEnv(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

export const env: AppConfig = {
  supabase: {
    url: getEnv('EXPO_PUBLIC_SUPABASE_URL'),
    anonKey: getEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
  },
  nvidia: {
    apiKey: getEnv('EXPO_PUBLIC_NVIDIA_API_KEY'),
    model: getEnv('EXPO_PUBLIC_NVIDIA_MODEL', 'meta/llama-3.2-11b-vision-instruct'),
    baseUrl: getEnv('EXPO_PUBLIC_NVIDIA_BASE_URL', 'https://integrate.api.nvidia.com/v1'),
    timeoutMs: parseInt(getEnv('EXPO_PUBLIC_NVIDIA_TIMEOUT_MS', '30000'), 10),
  },
  app: {
    name: getEnv('EXPO_PUBLIC_APP_NAME', 'Zekvolt'),
    version: getEnv('EXPO_PUBLIC_APP_VERSION', '1.0.0'),
  },
};

const REQUIRED_KEYS = [
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  'EXPO_PUBLIC_NVIDIA_API_KEY',
] as const;

/** Lista las variables requeridas que faltan (para diagnóstico). */
export function getMissingEnvVars(): string[] {
  return REQUIRED_KEYS.filter(key => !process.env[key]);
}

/** Advierte por consola si faltan variables requeridas (no lanza). */
export function validateEnv(): void {
  const missing = getMissingEnvVars();
  if (missing.length > 0) {
    console.warn(
      `⚠️ Variables de entorno faltantes: ${missing.join(', ')}.\n` +
      `Copia .env.example a .env y configura tus valores.`
    );
  }
}
