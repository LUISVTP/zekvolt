# Requisitos

Requisitos del sistema derivados del análisis del código fuente. Cuando un
requisito proviene del informe académico original se indica; si difiere del
código, **prevalece el código**.

## Requisitos funcionales

| ID | Descripción | Origen |
|----|-------------|--------|
| RF-01 | Registrarse e iniciar sesión con email y contraseña (Supabase Auth) | Informe + código |
| RF-02 | Recuperar la sesión persistente al abrir la app | Informe + código |
| RF-03 | Cerrar sesión | Informe + código |
| RF-04 | Onboarding: elegir departamento, estrato (1–6) y empresa distribuidora | Informe + código |
| RF-05 | Panel de consumo con factura estimada en COP, consumo diario/mensual y ranking de mayores consumidores | Informe + código |
| RF-06 | Listar electrodomésticos registrados | Informe + código |
| RF-07 | Agregar electrodoméstico (nombre, horas/día, cantidad) | Informe + código |
| RF-08 | Eliminar electrodoméstico | Informe + código |
| RF-09 | Escanear un electrodoméstico con la cámara y obtener lectura por IA | Informe + código |
| RF-10 | Seleccionar una imagen de la galería para analizar | Informe + código |
| RF-11 | Buscar especificaciones por modelo/descripción (texto) | Informe + código |
| RF-12 | Editar el perfil (ciudad, estrato, empresa) y persistirlo | Informe + código |
| RF-13 | Alternar entre modo oscuro y claro | Informe + código |
| RF-14 | Validar el wattaje detectado/ingresado contra el catálogo y advertir valores atípicos | Informe + código |

### Nota sobre `watts` en la base de datos

El informe describe una columna `watts` en `electrodomesticos` que se persiste
solo para aparatos fuera del catálogo. En el código actual la potencia se
resuelve siempre contra el catálogo estático (`src/data/appliances.ts`) y no se
almacena en la tabla. Por eso `supabase/schema.sql` no incluye esa columna. Ver
[modelo-datos.md](modelo-datos.md).

## Requisitos no funcionales

| ID | Descripción | Origen |
|----|-------------|--------|
| RNF-01 | TypeScript estricto (`strict: true`) en toda la base de código | Rediseño |
| RNF-02 | Configuración por variables de entorno `EXPO_PUBLIC_`; sin claves en el código | Rediseño (corrige el informe) |
| RNF-03 | Row Level Security en las tablas `profiles` y `electrodomesticos` | Informe + código |
| RNF-04 | Cálculo de consumo y factura en el cliente, sin llamadas extra al servidor | Informe + código |
| RNF-05 | Timeout de 30 s y reintentos ante rate limit (HTTP 429) en la llamada a la IA | Informe + código |
| RNF-06 | Mensajes de error traducidos al español | Informe + código |
| RNF-07 | Soporte de tema dual (oscuro/claro) con tokens de diseño | Informe + código |
| RNF-08 | Cobertura de 32 departamentos y empresas distribuidoras con tarifas por estrato | Informe + código |

## Diferencias informe vs. código

- **Proveedor de IA**: el informe y el código actual usan NVIDIA NIM
  (`meta/llama-3.2-11b-vision-instruct`). Versiones anteriores usaban Gemini;
  la migración a NVIDIA NIM ya está aplicada en el código.
- **Estructura de archivos**: el informe describe `src/theme/theme.js` y módulos
  `lib/*.js`. El rediseño introduce `src/styles/`, `src/services/`,
  `src/hooks/`, `src/types/` y TypeScript.
- **Columna `watts`**: ver nota arriba.
- **Navegación**: el informe describe navegación por estado en `App.js`; el
  código usa React Navigation con navegadores tipados en `src/navigation/`.
