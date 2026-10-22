# Changelog

Todo notable sobre este proyecto se documenta en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/),
y este proyecto adherido a [Semantic Versioning](https://semver.org/lang/es/).

## [No publicado]

## [1.0.0] - 2026-05-25

Reescritura completa de la base de código a TypeScript estricto, con migración
del backend de visión de Gemini a NVIDIA NIM. Corresponde al estado del código
en la release `0.2.0_apk` del repositorio original.

### Cambiado
- Migrado todo el código a TypeScript estricto (`strict: true`).
- Sustituido `expo-router` por React Navigation (Stack + Bottom Tabs).
- La configuración sensible ahora se carga desde variables de entorno
  (`EXPO_PUBLIC_*`) en lugar de estar hardcodeada.
- Migrada la visión por IA de Gemini a NVIDIA NIM
  (`meta/llama-3.2-11b-vision-instruct`).
- Cliente de Supabase inicializado de forma perezosa (`getSupabaseClient`).

### Añadido
- Esquema de base de datos (`supabase/schema.sql`) con constraints y RLS.
- Documentación en `docs/` (arquitectura, modelo de datos, flujo IA,
  requisitos y pruebas).
- CI con GitHub Actions.
- Plantillas de issues y pull requests.

### Eliminado
- Archivos legados de JavaScript (`.js`, `.bak`) y código duplicado.
- Claves API y credenciales del código fuente.

## Referencia de releases históricas

Las releases migradas desde el repositorio original se conservan con sus
mismos tags. Ver RELEASES.md para el detalle.

[No publicado]: https://github.com/LUISVTP/zekvolt/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/LUISVTP/zekvolt/releases/tag/v1.0.0
