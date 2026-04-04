-- Type de demande pour les messages contact (formulaire public).
alter table public.messages add column if not exists type text default 'info';
