-- MeCuadra · login por bot (ejecutar una vez en Supabase SQL Editor)

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

alter table public.telegram_auth_sessions enable row level security;
