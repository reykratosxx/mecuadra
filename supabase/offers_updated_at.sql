-- MeCuadra · updated_at en ofertas (ejecutar una vez en Supabase SQL Editor)

alter table public.offers
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.tg_offers_touch()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists offers_touch on public.offers;
create trigger offers_touch
  before update on public.offers
  for each row execute function public.tg_offers_touch();
