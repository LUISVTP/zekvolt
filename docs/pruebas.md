# Pruebas

Matriz de pruebas manuales (PT) de Zekvolt. Cada prueba indica el origen del
requisito que valida: **[I]** proviene del informe académico original, **[R]**
del rediseño actual. Si el informe y el código difieren, la prueba valida el
comportamiento del código.

## Requisitos cubiertos

| Prueba | Requisito | Descripción | Origen | Resultado |
|--------|-----------|-------------|--------|-----------|
| PT-01 | RF-01 | Registrarse con email y contraseña válidos crea la cuenta | I | Pendiente |
| PT-02 | RF-01 | Iniciar sesión con credenciales correctas abre la app | I | Pendiente |
| PT-03 | RF-01 | Credenciales incorrectas muestran error en español | I | Pendiente |
| PT-04 | RF-02 | Cerrar sesión y reabrir la app restaura la sesión persistida | I | Pendiente |
| PT-05 | RF-03 | Cerrar sesión devuelve al login y limpia el estado | I | Pendiente |
| PT-06 | RF-04 | Completar el onboarding (departamento, estrato, empresa) crea el perfil | I | Pendiente |
| PT-07 | RF-04 | El estrato acepta solo valores 1–6 | I | Pendiente |
| PT-08 | RF-05 | El panel muestra factura estimada, consumo diario/mensual y ranking | I | Pendiente |
| PT-09 | RF-07 | Agregar un electrodoméstico lo refleja en la lista y en el consumo | I | Pendiente |
| PT-10 | RF-08 | Eliminar un electrodoméstico lo quita de la lista y recalcula el consumo | I | Pendiente |
| PT-11 | RF-09 | Escanear un electrodoméstico devuelve nombre, watts y nivel de confianza | I | Pendiente |
| PT-12 | RF-11 | Buscar por texto devuelve especificaciones validadas | R | Pendiente |
| PT-13 | RF-14 | Un wattaje atípico respecto al catálogo genera advertencia y sugerencia | I | Pendiente |
| PT-14 | RF-12 | Editar el perfil y reabrir la app conserva los cambios | I | Pendiente |
| PT-15 | RF-13 / RNF-07 | Alternar modo oscuro/claro actualiza la interfaz | I | Pendiente |

## Seguridad

| Prueba | Descripción | Origen | Resultado |
|--------|-------------|--------|-----------|
| PT-S01 | RLS impide que un usuario lea perfiles o electrodomésticos de otro | I | Pendiente |
| PT-S02 | El repositorio no contiene claves ni credenciales; la configuración es por `.env` | R | Pendiente |

## Cómo ejecutarlas

1. Aplica `supabase/schema.sql` en un proyecto de Supabase de prueba.
2. Configura `.env` con credenciales de prueba (ver `.env.example`).
3. Arranca la app (`npx expo start`) en un dispositivo o emulador.
4. Ejecuta cada caso siguiendo la descripción y marca el resultado real en la
   columna **Resultado**.

## Automatización

Todas las pruebas de esta matriz son manuales. La verificación automatizada
disponible se limita a:

- `npm run typecheck` — TypeScript estricto.
- `npm run lint` — reglas de ESLint.

Comunidad: se aportan bienvenida pruebas unitarias (p. ej. con Jest) para
`src/utils/` y `src/data/`, que son funciones puras y fáciles de cubrir.
