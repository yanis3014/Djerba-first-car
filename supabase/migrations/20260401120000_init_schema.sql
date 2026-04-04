-- Schéma initial aligné sur lib/types.ts (cars, leads, messages).
-- Exécuter dans Supabase SQL Editor ou via CLI après lien du projet.

create extension if not exists "pgcrypto";

create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  brand text not null,
  model text not null,
  year int not null,
  price numeric not null,
  mileage int not null,
  fuel_type text not null,
  transmission text not null,
  color text,
  engine text,
  power int,
  doors int not null default 4,
  condition text not null,
  status text not null,
  description text,
  features jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  cover_image text,
  is_featured boolean not null default false,
  views int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cars_slug_idx on public.cars (slug);
create index if not exists cars_status_idx on public.cars (status);
create index if not exists cars_featured_idx on public.cars (is_featured);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  car_id uuid references public.cars (id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  message text,
  type text not null default 'info',
  status text not null default 'new',
  source text not null default 'website',
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists messages_created_idx on public.messages (created_at desc);
