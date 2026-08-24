-- MeCuadra · esquema de producción (Supabase)
-- Idempotente: se puede volver a ejecutar.

create extension if not exists pgcrypto;

do $$ begin
  create type condition_t as enum ('nuevo', 'usado', 'sellado');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type item_status_t as enum ('activo', 'pausado', 'canjeado');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type transport_t as enum ('tengo', 'sin', 'voy');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type offer_status_t as enum ('abierta', 'pausada', 'en_proceso', 'completada', 'cancelada');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type trade_status_t as enum ('pendiente', 'aceptado', 'entregado', 'completado', 'rechazado', 'cancelado');
exception when duplicate_object then null;
end $$;
do $$ begin
  create type category_t as enum (
    'alimentos','aseo','cuidado','medicamentos','bebidas','tabaco','ropa','hogar','ninos','otros'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  name text not null,
  avatar_url text,
  bio text default '',
  phone text unique,
  phone_verified boolean not null default false,
  province text not null default 'La Habana',
  municipality text not null default 'Plaza de la Revolución',
  neighborhood text default '',
  transport transport_t not null default 'sin',
  rating_avg numeric(3,2) not null default 0,
  rating_count int not null default 0,
  trades_completed int not null default 0,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists phone_verified boolean not null default false;
alter table public.profiles add column if not exists telegram_id bigint;

create unique index if not exists profiles_phone_unique
  on public.profiles (phone)
  where phone is not null;

create unique index if not exists profiles_telegram_id_unique
  on public.profiles (telegram_id)
  where telegram_id is not null;

create table if not exists public.telegram_links (
  token text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  chat_id bigint,
  created_at timestamptz not null default now()
);

create index if not exists telegram_links_user_idx on public.telegram_links (user_id);
alter table public.telegram_links add column if not exists chat_id bigint;

-- Login por bot (sin oauth / sin pedir teléfono en el navegador)
create table if not exists public.telegram_auth_sessions (
  token text primary key,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'consumed')),
  telegram_id bigint,
  first_name text,
  last_name text,
  username text,
  photo_url text,
  created_at timestamptz not null default now()
);

create index if not exists telegram_auth_sessions_status_idx
  on public.telegram_auth_sessions (status, created_at);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category category_t not null,
  condition condition_t not null,
  photos text[] not null default '{}',
  status item_status_t not null default 'activo',
  created_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_ids uuid[] not null,
  wants jsonb not null default '[]',
  open_to_proposals boolean not null default true,
  message text default '',
  province text not null,
  municipality text not null,
  neighborhood text default '',
  transport transport_t not null,
  status offer_status_t not null default 'abierta',
  featured boolean not null default false,
  views int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete cascade,
  owner_id uuid not null references public.profiles(id),
  applicant_id uuid not null references public.profiles(id),
  proposed_item_ids uuid[] not null default '{}',
  proposal_note text default '',
  status trade_status_t not null default 'pendiente',
  owner_delivered boolean not null default false,
  applicant_delivered boolean not null default false,
  owner_rated boolean not null default false,
  applicant_rated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint no_self_apply check (owner_id <> applicant_id)
);

-- Los mensajes se guardan cifrados (AES-256-GCM en el servidor). Nunca plaintext.
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid not null references public.trades(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  ciphertext text not null,
  created_at timestamptz not null default now()
);

-- Si existía la columna antigua `text`, se retira para no dejar plaintext.
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'messages' and column_name = 'text'
  ) then
    alter table public.messages drop column text;
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'messages' and column_name = 'ciphertext'
  ) then
    alter table public.messages add column ciphertext text not null default '';
  end if;
end $$;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  href text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid not null references public.trades(id) on delete cascade,
  from_id uuid not null references public.profiles(id),
  to_id uuid not null references public.profiles(id),
  stars int not null check (stars between 1 and 5),
  comment text default '',
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  unique (trade_id, from_id)
);

create index if not exists offers_status_created on public.offers (status, created_at desc);
create index if not exists offers_muni on public.offers (province, municipality);
create index if not exists trades_owner on public.trades (owner_id, status);
create index if not exists trades_applicant on public.trades (applicant_id, status);
create index if not exists messages_trade on public.messages (trade_id, created_at);
create index if not exists notif_user on public.notifications (user_id, created_at desc);

-- Perfil automático al registrarse (Google o teléfono)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  uname text;
  display_name text;
begin
  uname := coalesce(
    nullif(new.raw_user_meta_data->>'user_name', ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'u' || substr(replace(new.id::text, '-', ''), 1, 10)
  );
  uname := lower(regexp_replace(uname, '[^a-z0-9_]', '', 'g'));
  if uname is null or uname = '' then
    uname := 'u' || substr(replace(new.id::text, '-', ''), 1, 10);
  end if;
  if exists (select 1 from public.profiles p where p.username = uname) then
    uname := uname || substr(replace(new.id::text, '-', ''), 1, 4);
  end if;

  display_name := coalesce(
    nullif(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'name', ''),
    uname
  );

  insert into public.profiles (id, username, name, avatar_url, phone, phone_verified)
  values (
    new.id,
    uname,
    display_name,
    new.raw_user_meta_data->>'avatar_url',
    new.phone,
    new.phone is not null
  )
  on conflict (id) do update set
    phone = coalesce(excluded.phone, public.profiles.phone),
    phone_verified = public.profiles.phone_verified or excluded.phone_verified,
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.sync_profile_phone()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    phone = new.phone,
    phone_verified = new.phone is not null
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update of phone on auth.users
  for each row execute function public.sync_profile_phone();

create or replace function public.notify_user(p_user uuid, p_title text, p_body text, p_href text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, title, body, href)
  values (p_user, p_title, p_body, p_href);
end;
$$;

create or replace function public.tg_trades_touch()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trades_touch on public.trades;
create trigger trades_touch
  before update on public.trades
  for each row execute function public.tg_trades_touch();

create or replace function public.tg_on_trade_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    perform public.notify_user(
      new.owner_id,
      'Nueva aplicación MeCuadra',
      'Alguien aplicó a tu oferta. Ábrela para aceptar o rechazar.',
      '/chat/' || new.id::text
    );
    return new;
  end if;

  if new.status is distinct from old.status then
    if new.status = 'aceptado' then
      perform public.notify_user(
        new.applicant_id,
        'Aceptaron tu trueque',
        'Ya puedes coordinar el encuentro en el chat.',
        '/chat/' || new.id::text
      );
    elsif new.status = 'rechazado' then
      perform public.notify_user(
        new.applicant_id,
        'No se aceptó tu propuesta',
        'Puedes aplicar a otra oferta o ajustar lo que ofreces.',
        '/explorar'
      );
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trades_notify on public.trades;
create trigger trades_notify
  after insert or update of status on public.trades
  for each row execute function public.tg_on_trade_change();

alter table public.profiles enable row level security;
alter table public.telegram_links enable row level security;
alter table public.telegram_auth_sessions enable row level security;
alter table public.items enable row level security;
alter table public.offers enable row level security;
alter table public.trades enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.ratings enable row level security;

drop policy if exists "profiles are readable" on public.profiles;
drop policy if exists "own profile" on public.profiles;
drop policy if exists "own profile insert" on public.profiles;
create policy "profiles are readable" on public.profiles for select using (true);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile" on public.profiles for update using (auth.uid() = id);

drop policy if exists "own telegram link" on public.telegram_links;
drop policy if exists "own telegram link insert" on public.telegram_links;
create policy "own telegram link" on public.telegram_links
  for select using (auth.uid() = user_id);
create policy "own telegram link insert" on public.telegram_links
  for insert with check (auth.uid() = user_id);

drop policy if exists "items public" on public.items;
drop policy if exists "own items insert" on public.items;
drop policy if exists "own items update" on public.items;
create policy "items public" on public.items for select using (true);
create policy "own items insert" on public.items for insert with check (auth.uid() = user_id);
create policy "own items update" on public.items for update using (auth.uid() = user_id);

drop policy if exists "offers public" on public.offers;
drop policy if exists "own offers insert" on public.offers;
drop policy if exists "own offers update" on public.offers;
create policy "offers public" on public.offers for select using (true);
create policy "own offers insert" on public.offers for insert with check (auth.uid() = user_id);
create policy "own offers update" on public.offers for update using (auth.uid() = user_id);

drop policy if exists "trades visible to peers" on public.trades;
drop policy if exists "apply" on public.trades;
drop policy if exists "trade parties update" on public.trades;
create policy "trades visible to peers" on public.trades
  for select using (auth.uid() in (owner_id, applicant_id));
create policy "apply" on public.trades
  for insert with check (auth.uid() = applicant_id);
create policy "trade parties update" on public.trades
  for update using (auth.uid() in (owner_id, applicant_id));

drop policy if exists "chat peers" on public.messages;
drop policy if exists "chat send" on public.messages;
create policy "chat peers" on public.messages
  for select using (
    exists (
      select 1 from public.trades t
      where t.id = trade_id and auth.uid() in (t.owner_id, t.applicant_id)
    )
  );
create policy "chat send" on public.messages
  for insert with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.trades t
      where t.id = trade_id and auth.uid() in (t.owner_id, t.applicant_id)
    )
  );

drop policy if exists "own notifs" on public.notifications;
drop policy if exists "own notifs update" on public.notifications;
create policy "own notifs" on public.notifications
  for select using (auth.uid() = user_id);
create policy "own notifs update" on public.notifications
  for update using (auth.uid() = user_id);

drop policy if exists "ratings public" on public.ratings;
drop policy if exists "rate once" on public.ratings;
create policy "ratings public" on public.ratings for select using (true);
create policy "rate once" on public.ratings for insert with check (auth.uid() = from_id);

insert into storage.buckets (id, name, public)
values ('items', 'items', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
drop policy if exists "auth upload media" on storage.objects;
drop policy if exists "own update media" on storage.objects;
drop policy if exists "own delete media" on storage.objects;

create policy "public read media"
  on storage.objects for select
  using (bucket_id in ('items', 'avatars'));

create policy "auth upload media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('items', 'avatars')
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "own update media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('items', 'avatars')
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "own delete media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('items', 'avatars')
    and split_part(name, '/', 1) = auth.uid()::text
  );

do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table public.trades;
exception when duplicate_object then null;
end $$;
