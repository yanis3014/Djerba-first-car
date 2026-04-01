-- RLS : lecture catalogue publique, écriture admin pour les voitures,
-- insertion publique (anon) pour leads/messages, lecture admin uniquement.

alter table public.cars enable row level security;
alter table public.leads enable row level security;
alter table public.messages enable row level security;

-- Helpers JWT (rôle admin dans app_metadata ou user_metadata)
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

-- CARS
drop policy if exists "cars_select_public" on public.cars;
create policy "cars_select_public"
  on public.cars for select
  using (true);

drop policy if exists "cars_write_admin" on public.cars;
create policy "cars_write_admin"
  on public.cars for all
  using (public.is_admin())
  with check (public.is_admin());

-- LEADS (formulaires publics + admin)
drop policy if exists "leads_insert_public" on public.leads;
create policy "leads_insert_public"
  on public.leads for insert
  with check (true);

drop policy if exists "leads_select_admin" on public.leads;
create policy "leads_select_admin"
  on public.leads for select
  using (public.is_admin());

drop policy if exists "leads_update_admin" on public.leads;
create policy "leads_update_admin"
  on public.leads for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "leads_delete_admin" on public.leads;
create policy "leads_delete_admin"
  on public.leads for delete
  using (public.is_admin());

-- MESSAGES (contact)
drop policy if exists "messages_insert_public" on public.messages;
create policy "messages_insert_public"
  on public.messages for insert
  with check (true);

drop policy if exists "messages_select_admin" on public.messages;
create policy "messages_select_admin"
  on public.messages for select
  using (public.is_admin());

drop policy if exists "messages_update_admin" on public.messages;
create policy "messages_update_admin"
  on public.messages for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "messages_delete_admin" on public.messages;
create policy "messages_delete_admin"
  on public.messages for delete
  using (public.is_admin());
