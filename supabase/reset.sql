-- ─── Zekvolt: reinicio de la base de datos ─────────────────────────────
-- ATENCIÓN: borra las tablas profiles y electrodomesticos con todos sus datos.
-- Ejecutar ANTES de schema.sql, solo cuando se quiera empezar de cero.
-- No toca auth.users ni otras tablas del proyecto.

drop table if exists public.electrodomesticos cascade;
drop table if exists public.profiles cascade;
