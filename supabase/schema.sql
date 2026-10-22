-- ─── Zekvolt: esquema de base de datos ──────────────────────────────────
-- Ejecutar en el SQL Editor de Supabase (o via psql) sobre el proyecto.

-- Tabla de perfiles: 1:1 con auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  city text not null,
  estrato integer not null check (estrato between 1 and 6),
  company text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabla de electrodomésticos por usuario
create table if not exists public.electrodomesticos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  hours numeric not null check (hours >= 0),
  qty integer not null check (qty >= 1),
  created_at timestamptz not null default now()
);

create index if not exists idx_electrodomesticos_user_id
  on public.electrodomesticos (user_id);

-- ─── Row Level Security ─────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.electrodomesticos enable row level security;

-- Profiles: cada usuario solo ve/edita la suya
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid () = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid () = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid () = id)
  with check (auth.uid () = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid () = id);

-- Electrodomésticos: cada usuario gestiona los suyos
drop policy if exists "electrodomesticos_select_own" on public.electrodomesticos;
create policy "electrodomesticos_select_own"
  on public.electrodomesticos for select
  using (auth.uid () = user_id);

drop policy if exists "electrodomesticos_insert_own" on public.electrodomesticos;
create policy "electrodomesticos_insert_own"
  on public.electrodomesticos for insert
  with check (auth.uid () = user_id);

drop policy if exists "electrodomesticos_update_own" on public.electrodomesticos;
create policy "electrodomesticos_update_own"
  on public.electrodomesticos for update
  using (auth.uid () = user_id)
  with check (auth.uid () = user_id);

drop policy if exists "electrodomesticos_delete_own" on public.electrodomesticos;
create policy "electrodomesticos_delete_own"
  on public.electrodomesticos for delete
  using (auth.uid () = user_id);
