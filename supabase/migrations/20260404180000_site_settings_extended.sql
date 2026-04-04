-- Champs supplémentaires : horaires, hero homepage, TikTok.

alter table public.site_settings
  add column if not exists hours_weekday text not null default '8h00 - 18h00',
  add column if not exists hours_sunday text not null default '9h00 - 14h00',
  add column if not exists hero_title text not null default 'L''ÉMOTION DE CONDUIRE',
  add column if not exists hero_subtitle text not null default 'COMMENCE ICI',
  add column if not exists hero_body text not null default 'Chaque véhicule est une promesse.',
  add column if not exists tiktok_url text not null default '',
  add column if not exists tiktok_label text not null default '@djerbafirstcar';
