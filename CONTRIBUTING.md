# Contribuir a Zekvolt

Gracias por tu interés en mejorar Zekvolt. Este documento explica cómo
trabajar en el proyecto y qué se espera de cada contribución.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior
- Expo CLI (`npx expo --version`)
- Una cuenta de [Supabase](https://supabase.com) para probar el backend
- Una API key de [NVIDIA NIM](https://build.nvidia.com) para la visión IA

## Preparación del entorno

1. Clona el repositorio e instala dependencias:

   ```bash
   npm ci
   ```

2. Copia las variables de entorno y llénalas:

   ```bash
   cp .env.example .env
   ```

   Completa `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` y
   `EXPO_PUBLIC_NVIDIA_API_KEY`. Consulta `docs/arquitectura.md` para el detalle.

3. Aplica el esquema de base de datos (`supabase/schema.sql`) en tu proyecto de
   Supabase.

## Flujo de trabajo

1. Crama un `branch` desde `main` con nombre descriptivo
   (`feat/...`, `fix/...`, `docs/...`).
2. Haz cambios pequeños y enfocados.
3. Antes de abrir el PR, ejecuta las verificaciones:

   ```bash
   npm run typecheck
   npm run lint
   ```

4. Abre un pull request describiendo el cambio y cómo probarlo.

## Convenciones

- **Idioma**: español para documentación, comentarios y mensajes visibles.
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/es/1.0.0/)
  (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- **TypeScript estricto**: no se permite `any` salvo justificación explícita.
- **Secretos**: nunca subas claves ni `.env`; se validan por variables de entorno.

## Reportar bugs y solicitar features

Usa las plantillas de issues del repositorio. Incluye pasos de reproducción,
versión del sistema y, si aplica, logs o capturas.

## Licencia

Al contribuir aceptas que tu aporte se distribuya bajo la licencia MIT del
proyecto (ver `LICENSE`).
