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

## Worked example (Lisbon)

Ana has a folding bike she no longer uses. She wants a 35mm film camera. She does **not** want a euro or sats price.

1. **Sign in with a Bitcoin key.** The browser derives nsec/npub (secp256k1). MeCuadra never sees the nsec. The account is the npub.
2. **Mint a Cashu stamp and publish.** Offer: folding bike ↔ camera, city Lisbon. No KYC. The stamp is anti-spam, not the price of the bike. The offer can also hit Nostr relays (kind 31112).
3. **Bruno applies** from Porto: he taps MeCuadra and proposes his Olympus. No Lightning “to make up the difference”.
4. **NIP-44 chat.** They pick a café near Cais do Sodré. The server stores ciphertext only.
5. **Meet, confirm, rate.** Each marks delivered. They rate 5 stars. A **ZK badge** can show “enough good swaps” without publishing that Ana traded with Bruno.

If she had *sold* the bike for sats, the ledger would keep a clusterable payment forever. Here there is **no payment**. Line for the video: *no payment trail because there is no payment*.

Full writeup in the app: `/docs/cypherpunk`.

## Does ZK make it stronger?

Yes — if we stay honest. Without ZK, a “private” marketplace still publishes a **graph** (who rated whom). That clusters like a payment history. The badge is trust without a dossier.

Two layers:

| Layer | What it is | What it is not |
| --- | --- | --- |
| **Runtime** (`src/lib/zk/reputation.ts`) | Pedersen + OR range proofs, verified in the browser | Not Bitcoin Script |
| **SNARK** (`circuits/reputation.circom`) | Circom → fflonk → two public SHA256-split outputs, same interface as [BitVM/bitvm-circom-example](https://github.com/BitVM/bitvm-circom-example) | We do **not** run BitVM’s ~GB Script verifier |

We do not fake L1 Groth16 verify. ZK’s impact is product: reputation stops being a public graph. The circuit is real and cut to BitVM’s interface for later — not theater.

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
