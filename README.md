# MeCuadra

Global P2P **barter** marketplace (hackathon fork: `hackathon/boss-battle`).
Production Cuba/Telegram lives on `main` — do not merge this branch until after BOSS Battle.

Tagline: **Barter without a trail. Bitcoin keys, zero prices, private by default.**

## Stack

- Next.js (App Router) on Vercel
- Supabase: Auth, Postgres, Storage, Realtime
- Login: **Bitcoin / Nostr keys** (NIP-07 or nsec in the browser). Telegram is optional legacy.
- Explore: public
- Publish / apply: signed-in
- Chat: **NIP-44** E2EE (server stores ciphertext only)
- Anti-spam: Cashu test-mint stamp (never a price for goods)
- Reputation: Pedersen CSV in the browser + Circom/fflonk circuit shaped like [BitVM/bitvm-circom-example](https://github.com/BitVM/bitvm-circom-example) (`circuits/README.md`)

## Isolated env (do not reuse Cuba production)

Create a **separate** Supabase project. In `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CASHU_MINT_URL=https://testnut.cashu.space
NEXT_PUBLIC_NOSTR_RELAYS=wss://relay.damus.io,wss://nos.lol
CASHU_DEMO_SECRET=
MESSAGE_ENCRYPTION_KEY=
```

Run `supabase/schema.sql` then `supabase/hackathon_cypherpunk.sql`.

`MESSAGE_ENCRYPTION_KEY` is optional on this branch (NIP-44 does not use it).

## Dev

```bash
npm install
npm run dev
```

Switch language with the globe icon (EN / ES) in the header.

## Hackathon

See [HACKATHON.md](HACKATHON.md) for BOSS Battle tracks, demo script, and Devfolio copy.
