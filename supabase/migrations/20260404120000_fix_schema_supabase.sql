-- Réparation idempotente du schéma (éditeur SQL Supabase ou `supabase db push`).
-- Les politiques d’écriture utilisent public.is_admin() comme le reste du projet
-- (pas seulement auth.role() = 'authenticated', qui exposerait les mises à jour à tout compte).

create extension if not exists "pgcrypto";

-- Requis pour les politiques admin (identique à 20260401120001_row_level_security.sql).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  )
  or coalesce(
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- 1) site_settings
create table if not exists public.site_settings (
  id integer primary key default 1,
  phone_display text not null default '+216 XX XXX XXX',
  whatsapp_number text not null default '',
  contact_email text not null default '',
  address text not null default 'Djerba Houmt Essouk, Route Midoun Km2',
  instagram_url text not null default '',
  instagram_label text not null default '@djerbafirstcar',
  facebook_url text not null default '',
  facebook_label text not null default 'Djerba First Car',
  updated_at timestamptz default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_select_public" on public.site_settings;
drop policy if exists "site_settings_write_admin" on public.site_settings;
drop policy if exists "site_settings_public_read" on public.site_settings;
drop policy if exists "site_settings_auth_write" on public.site_settings;

create policy "site_settings_public_read"
  on public.site_settings for select
  using (true);

create policy "site_settings_auth_write"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());

-- 2) leads.archived
alter table public.leads add column if not exists archived boolean not null default false;

create index if not exists idx_leads_archived on public.leads (archived);

-- 3) RPC vues voiture
create or replace function public.increment_car_views(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.cars
  set views = coalesce(views, 0) + 1,
      updated_at = now()
  where id = p_id;
end;
$$;

grant execute on function public.increment_car_views(uuid) to anon, authenticated;

-- 4) messages.type (formulaire contact — aligné sur lib/actions/contact.ts)
alter table public.messages add column if not exists type text default 'info';
