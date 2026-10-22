# Zekvolt

**Regulación eléctrica residencial para Colombia.**

Zekvolt es una aplicación móvil construida con React Native y Expo que ayuda a
los hogares a entender y regular su consumo de energía eléctrica. Estima la
factura mensual en pesos colombianos según la tarifa real de tu empresa
distribuidora y tu estrato socioeconómico, gestiona tus electrodomésticos y
aporta recomendaciones de ahorro.

- **Stack**: React Native 0.83 · Expo SDK 55 · TypeScript estricto
- **Backend**: Supabase (autenticación + PostgreSQL con Row Level Security)
- **Visión IA**: NVIDIA NIM · `meta/llama-3.2-11b-vision-instruct`
- **Licencia**: MIT

## Características

- **Onboarding**: configuración inicial con departamento, estrato (1–6) y
  empresa energética.
- **Panel de consumo**: factura mensual estimada en COP, consumo diario/mensual
  y ranking de mayores consumidores.
- **Gestión de electrodomésticos**: catálogo con potencia típica en watts,
  horas de uso y cantidad; consumo y costo por aparato.
- **Escaneo por IA**: identifica un electrodoméstico desde la cámara, lee la
  potencia de la etiqueta técnica (W o V×A) y estima el consumo.
- **Ajustes**: edición del perfil con guardado en base de datos.
- **Temas dual**: modo oscuro y claro con tokens de color propios.

## Inicio rápido

1. **Instala dependencias**

   ```bash
   npm ci
   ```

2. **Configura las variables de entorno**

   ```bash
   cp .env.example .env
   ```

   Edita `.env` con tus valores. Consulta `docs/arquitectura.md` para el detalle
   de cada variable.

3. **Prepara la base de datos**

   Ejecuta `supabase/schema.sql` en el SQL Editor de tu proyecto Supabase. Crea
   las tablas `profiles` y `electrodomesticos` con sus políticas RLS.

4. **Arranca la app**

   ```bash
   npx expo start
   ```

   Luego escanea el QR con Expo Go, o pulsa `a` / `i` para Android / iOS.

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Arranca el servidor de desarrollo de Expo |
| `npm run android` | Abre en dispositivo/emulador Android |
| `npm run ios` | Abre en dispositivo/simulador iOS |
| `npm run web` | Abre en el navegador |
| `npm run typecheck` | Verifica tipos con TypeScript estricto |
| `npm run lint` | Ejecuta el linter (ESLint) |

## Estructura del proyecto

```
src/
  components/   # Componentes reutilizables (UI, home, appliances, camera, ...)
  config/       # Carga y validación de variables de entorno
  data/         # Datos estáticos: catálogo, tarifas, empresas, tips
  hooks/        # Hooks de React (auth, tema, perfil, visión, ...)
  lib/          # Clientes: Supabase y NVIDIA NIM
  navigation/   # Navegación (auth, tabs principales, raíz)
  screens/      # Pantallas (auth y principales)
  services/     # Lógica de negocio y acceso a datos
  styles/       # Tema, colores, espaciado, tipografía
  types/        # Tipos centrales compartidos
  utils/        # Utilidades: cálculos, formateo, validación
supabase/
  schema.sql    # Esquema de base de datos con RLS
docs/           # Documentación: arquitectura, datos, IA, requisitos, pruebas
```

## Documentación

- [Arquitectura](docs/arquitectura.md)
- [Modelo de datos](docs/modelo-datos.md)
- [Flujo de visión IA](docs/flujo-ia.md)
- [Requisitos](docs/requisitos.md)
- [Pruebas](docs/pruebas.md)
- [Releases históricas](RELEASES.md)
- [Changelog](CHANGELOG.md)

## Contribuir

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) y el [código de conducta](CODE_OF_CONDUCT.md).

## Seguridad

Este proyecto no incluye credenciales. Nunca subas claves ni el archivo `.env`
al repositorio. Si encuentras una vulnerabilidad, repórtala de forma privada a
los mantenedores.
