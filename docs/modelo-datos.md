# Modelo de datos

Zekvolt usa Supabase (PostgreSQL) con dos tablas principales. El esquema
completo, con constraints e índices, está en [`supabase/schema.sql`](../supabase/schema.sql).

## Tablas

### `profiles`

Perfil del usuario, relación 1:1 con `auth.users`.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` (PK) | = `auth.users.id` |
| `city` | `text` | Departamento / ciudad |
| `estrato` | `integer` | Estrato socioeconómico (1–6) |
| `company` | `text` | Empresa distribuidora |
| `created_at` | `timestamptz` | Fecha de creación |
| `updated_at` | `timestamptz` | Última actualización |

### `electrodomesticos`

Electrodomésticos registrados por el usuario.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | `uuid` (PK) | Identificador |
| `user_id` | `uuid` (FK → `auth.users`) | Propietario |
| `name` | `text` | Clave del catálogo (ej. `"Nevera/Refrigerador"`) |
| `hours` | `numeric` | Horas de uso por día |
| `qty` | `integer` | Cantidad de unidades |
| `created_at` | `timestamptz` | Fecha de creación |

El potencial en watts **no** se almacena en la tabla: se resuelve en tiempo de
ejecución contra el catálogo estático (`src/data/appliances.ts`) usando el
campo `name`. Esto evita duplicar datos y mantener una sola fuente de verdad
para la potencia típica de cada aparato.

## Row Level Security

RLS está habilitado en ambas tablas. Cada política limita las operaciones al
usuario autenticado (`auth.uid()`) dueño de la fila:

- `profiles`: `select`, `insert`, `update`, `delete` propios.
- `electrodomesticos`: `select`, `insert`, `update`, `delete` propios.

Un usuario nunca puede leer ni modificar datos de otro.

## Mapeo con TypeScript

Los tipos que reflejan estas tablas viven en `src/types/index.ts`:

- `Profile` ↔ tabla `profiles`.
- `Appliance` ↔ tabla `electrodomesticos`.
- `ApplianceWithComputed` extiende `Appliance` con valores derivados en cliente
  (`watts`, `monthlyKwh`, `monthlyCost`, `icon`, `defaultHours`).

Los servicios (`profile.service`, `appliance.service`) son los únicos que
traducen entre tipos de Supabase y tipos de dominio.

## Cálculos derivados

El consumo se calcula en cliente a partir de la potencia del catálogo:

```
kWh mensual = (watts × hours × 30 × qty) / 1000
factura     = kWh mensual × tarifa (COP/kWh)
```

La tarifa depende de la empresa y el estrato, resuelta por
`src/data/tariffs.ts` (ver `useTariff` y `tariff.service`).
