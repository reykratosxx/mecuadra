-- Idempotent. Safe to re-run on the shared MeCuadra Supabase project.
-- Does not rewrite Cuba province/municipality defaults.

alter table public.profiles add column if not exists npub text;
alter table public.profiles add column if not exists pubkey_hex text;
alter table public.profiles add column if not exists silent_payment_code text;
alter table public.profiles add column if not exists zk_proof jsonb;
alter table public.profiles add column if not exists zk_nullifier text;

create unique index if not exists profiles_npub_unique
  on public.profiles (npub)
  where npub is not null;

alter table public.offers add column if not exists nostr_event_id text;
alter table public.messages add column if not exists scheme text default 'nip44';
alter table public.ratings add column if not exists attestation jsonb;

create table if not exists public.zk_proofs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  nullifier text not null,
  proof jsonb not null,
  created_at timestamptz not null default now()
);

create unique index if not exists zk_proofs_nullifier_unique
  on public.zk_proofs (nullifier);

alter table public.zk_proofs enable row level security;
drop policy if exists "zk proofs public" on public.zk_proofs;
drop policy if exists "zk proofs insert" on public.zk_proofs;
create policy "zk proofs public" on public.zk_proofs for select using (true);
create policy "zk proofs insert" on public.zk_proofs
  for insert with check (auth.uid() = user_id);
