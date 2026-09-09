# MeCuadra — BOSS Battle (Bitshala)

Branch: `hackathon/boss-battle` (keep `main` as Cuba production).

Event: [BOSS Battle](https://boss-battle.devfolio.co) · 7 Sep–5 Oct 2026 · [Devfolio MCP](https://guide.devfolio.co/docs/guide/devfolio-mcp)

Tracks to apply: **Cypherpunk** (primary) and **Freedom Stack**.

Tagline: *Barter without a trail. Bitcoin keys, zero prices, private by default.*

## Problem

Bitcoin’s ledger is a permanent dossier. Most “privacy wallets” still assume you are **paying**. The cypherpunk move for everyday goods is not another mixer — it is **not putting the swap on a public money rail**, and not rebuilding that graph inside a KYC app (Telegram phone, server-readable chat, clusterable ratings).

## Solution

MeCuadra stays a **trueque**: no prices, no sats for goods, no “pay the difference”.

The private path is the default:

1. Identity = secp256k1 (Bitcoin = Nostr npub). No phone KYC.
2. One Silent Payment-style contact code; each match derives a unique shared secret (BIP-352 idea).
3. Chat is **NIP-44**. The API stores ciphertext only.
4. Offers also publish as kind `31112` parameterized replaceable events on relays.
5. Publishing costs a **Cashu anti-spam token** (test mint / demo stamp) — never a goods price. Lightning invoices here are minting/signaling, not settlement.
6. Reputation is a **ZK badge**:
   - Runtime: Pedersen commitments + OR range proofs (client-side validation — Bitcoin Script does not check this). Counterparties and exact stars stay off the profile.
   - SNARK path: [BitVM/bitvm-circom-example](https://github.com/BitVM/bitvm-circom-example) — Circom + **fflonk**, **two** public outputs (SHA256 split). See `circuits/README.md`. We do not run BitVM's gigabyte Script verifier in the app.

## How it fits Cypherpunk

*Make Bitcoin private in practice* and *make the private path the easy path*: the easy signup is a key, not Cubacel SMS; the easy chat is E2EE; the easy reputation is a badge, not a sold trade graph; the easy commerce is barter so there is no on-chain payment trail at all.

## How it fits Freedom Stack

Nostr identity + encrypted offers/DMs + Cashu, without Telegram/Google as a required intermediary.

## Honest limits

- Runtime badge is **client-side validation** (Pedersen). The Circom circuit is **fflonk**-shaped for BitVM (`circuits/README.md`), not a fake L1 Groth16 verify.
- Cashu mainnet Lightning pay-to-mint may be down in demo; the API can issue a clearly labeled demo stamp.
- Neighborhood is not public; city is.

## Demo script (2–3 min, English)

1. Globe icon → English.
2. Sign in: generate nsec (show backup) or NIP-07.
3. Profile: npub + Silent Payment code.
4. Mint Cashu stamp → publish an offer (city only).
5. Second browser: apply → NIP-44 chat (server has no plaintext).
6. Complete + rate → Generate ZK proof → badge. Show public signals (no names).
7. Optional: relay event id on the offer.

## Devfolio

The project is still a **draft**, so `https://devfolio.co/projects/mecuadra-8c8f` **404s**. Devfolio only lists published projects ([submission guide](https://guide.devfolio.co/docs/guide/participating-in-hackathons/project-submission)). The public gallery is empty until you publish: [boss-battle.devfolio.co/projects](https://boss-battle.devfolio.co/projects).

Open the draft while logged in as [manudev97](https://devfolio.co/@manudev97):

1. [BOSS Battle](https://boss-battle.devfolio.co) → Dashboard → **Edit project** (slug `mecuadra-8c8f`).
2. Tracks already applied: **Cypherpunk** + **Freedom Stack**.

Do **not** publish until you upload a real screenshot (1–6) and, ideally, a demo video. Do not generate fake screenshots. After publish, the public URL will be:

- `https://boss-battle.devfolio.co/projects/mecuadra-8c8f`
- `https://devfolio.co/projects/mecuadra-8c8f`

## Contacts

Hackathon: hackathon@bitshala.org · Discord Bitshala.
