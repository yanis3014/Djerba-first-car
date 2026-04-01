-- Compteur de vues côté public sans ouvrir un UPDATE général sur cars (RLS admin seulement).

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
