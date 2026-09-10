# MeCuadra

**Barter without a trail.** Private by default.

A global P2P **barter** marketplace: publish what you have, apply for what you need, close the swap in person. No prices, no deposits, no on-chain payment for goods.

This is the **BOSS Battle** fork on `hackathon/boss-battle`. Cuba production (Telegram) stays on `main` — do not merge this branch into `main`.

**Live demo:** [hackathon preview](https://mecuadra-14n4uwt8d-reykratosxx-7776s-projects.vercel.app)  
**ZK docs (run the proof in the browser):** [/docs/zk](https://mecuadra-14n4uwt8d-reykratosxx-7776s-projects.vercel.app/docs/zk)  
**Devfolio:** [mecuadra-8c8f](https://devfolio.co/projects/mecuadra-8c8f)

Builder: **Enmanuel Cabrera** ([@manudev97](https://github.com/manudev97) · [devfolio.co/@manudev97](https://devfolio.co/@manudev97)). Repo hosted on [@reykratosxx](https://github.com/reykratosxx) so the Vercel Hobby deploy is not blocked by CPU limits on the primary account.

## What ships

- Identity = secp256k1 (same curve as Bitcoin / Nostr `npub`). No phone KYC.
- Offers also publish as Nostr kind `31112`.
- Chat is **NIP-44**. The server stores ciphertext only.
- Publish uses a **Cashu** anti-spam stamp — never a price for the bicycle.
- Public trust signal is a **ZK badge**, not a guest list of who you traded with. Pedersen + OR range proofs verify in the visitor’s browser. Circom follows [BitVM/bitvm-circom-example](https://github.com/BitVM/bitvm-circom-example) (`out_1` / `out_2`).
- UI in **English and Spanish** (globe in the header).

## Stack

- Next.js (App Router) on Vercel
- Supabase: Auth, Postgres, Storage, Realtime
- Login: Bitcoin / Nostr keys (NIP-07 or `nsec` in the browser). Telegram is optional legacy.
- Explore: public. Publish / apply: signed-in.

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
