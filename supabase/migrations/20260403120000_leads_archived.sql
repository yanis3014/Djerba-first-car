-- Permet d'archiver des leads sans les supprimer (actions en masse admin).
alter table public.leads
  add column if not exists archived boolean not null default false;

create index if not exists idx_leads_archived on public.leads (archived);
