# Arquitectura

Zekvolt es una app React Native (Expo) con arquitectura por capas. La
separación entre UI, servicios y clientes de bajo nivel permite sustituir el
backend o el proveedor de IA sin tocar la capa de presentación.

## Capas

```
Pantallas (screens)
   │  usan
   ▼
Hooks (hooks)  ──orquestan──▶  Servicios (services)
   │                              │  usan
   ▼                              ▼
Componentes (components)      Librerías (lib)  ──▶  Supabase / NVIDIA NIM
                                  │
                                  ▼
                             Config (config/env)
```

- **`screens/`** — Pantallas de autenticación y principales. Consumen hooks y
  componentes; no acceden directamente a la red.
- **`hooks/`** — Encapsulan estado y efectos (`useAuth`, `useProfile`,
  `useAppliances`, `useVision`, `useTheme`, `useTariff`, `useCamera`).
- **`services/`** — Lógica de negocio y acceso a datos (`auth.service`,
  `profile.service`, `appliance.service`, `vision.service`, `tariff.service`).
- **`lib/`** — Clientes de bajo nivel: `supabase.ts` (singleton perezoso) y
  `nvidia.ts` (visión IA).
- **`components/`** — UI reutilizable organizada por dominio (`ui`, `home`,
  `appliances`, `camera`, `settings`, `layout`, `icons`, `logo`).
- **`data/`** — Datos estáticos: catálogo de electrodomésticos, tarifas,
  empresas y consejos.
- **`config/`** — Carga y validación de variables de entorno (`env.ts`).
- **`types/`** — Tipos compartidos en todo el proyecto.

## Navegación

`src/navigation/` define tres navegadores:

- **RootNavigator** — Decide entre `AuthNavigator` y `MainTabNavigator` según
  la sesión.
- **AuthNavigator** — Stack de splash, login, registro y configuración.
- **MainTabNavigator** — Tabs principales (inicio, electrodomésticos, escanear,
  ajustes).

Los parámetros tipados viven en `src/navigation/types.ts`.

## Configuración y secretos

La configuración sensible se lee desde variables de entorno con prefijo
`EXPO_PUBLIC_` (ver `.env.example`). `src/config/env.ts` las expone como objeto
`env` tipado y valida su presencia al arrancar. Ninguna clave viaja en el
código fuente.

Variables principales:

- `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` — backend.
- `EXPO_PUBLIC_NVIDIA_API_KEY`, `EXPO_PUBLIC_NVIDIA_MODEL`,
  `EXPO_PUBLIC_NVIDIA_BASE_URL`, `EXPO_PUBLIC_NVIDIA_TIMEOUT_MS` — visión IA.

## Cliente de Supabase

`src/lib/supabase.ts` implementa un singleton perezoso vía
`getSupabaseClient()`. El cliente solo se instancia en el primer uso, lo que
evita importar `env` (y sus validaciones) en el arranque y permite arrancar la
app en modo desarrollo sin backend configurado.

## Tema y diseño

`src/styles/` centraliza el sistema de diseño: tokens de color (cyan, gold,
fondos), espaciado y tipografía. `useTheme()` expone el tema activo y permite
alternar entre modo oscuro y claro.

## Modelo de datos

Ver [modelo-datos.md](modelo-datos.md) para el esquema de Supabase y el mapeo
entre tipos TypeScript y tablas.
