-- Paramètres globaux du site (singleton id = 1).

create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  phone_display text not null default '+216 XX XXX XXX',
  whatsapp_number text not null default '',
  contact_email text not null default '',
  address text not null default 'Djerba, Houmt Essouk, Route Midoun Km2',
  instagram_url text not null default '',
  instagram_label text not null default '@djerbafirstcar',
  facebook_url text not null default '',
  facebook_label text not null default 'Djerba First Car',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_select_public" on public.site_settings;
create policy "site_settings_select_public"
  on public.site_settings for select
  using (true);

drop policy if exists "site_settings_write_admin" on public.site_settings;
create policy "site_settings_write_admin"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());
