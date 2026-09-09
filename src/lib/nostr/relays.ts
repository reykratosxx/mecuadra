import { finalizeEvent, type EventTemplate } from "nostr-tools/pure";
import { SimplePool } from "nostr-tools/pool";
import { loadIdentity, parseNpub } from "./keys";
import { encryptNip44 } from "./nip44";

export const DEFAULT_RELAYS = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.primal.net",
];

/** Parameterized replaceable: MeCuadra offer (NIP-33). */
export const KIND_OFFER = 31112;

export function offerRelays() {
  const extra = process.env.NEXT_PUBLIC_NOSTR_RELAYS;
  if (!extra) return DEFAULT_RELAYS;
  return [...new Set([...DEFAULT_RELAYS, ...extra.split(",").map((s) => s.trim()).filter(Boolean)])];
}

export type PublicOfferPayload = {
  id: string;
  title: string;
  wants: string;
  country: string;
  city: string;
  /** Never the full npub on the public card — hashed tag only. */
  authorHint: string;
};

export async function publishOfferToRelays(payload: PublicOfferPayload) {
  const id = loadIdentity();
  if (!id) throw new Error("No Nostr identity");
  const template: EventTemplate = {
    kind: KIND_OFFER,
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ["d", payload.id],
      ["t", "mecuadra"],
      ["l", payload.country],
      ["client", "mecuadra"],
    ],
    content: JSON.stringify({
      title: payload.title,
      wants: payload.wants,
      country: payload.country,
      city: payload.city,
      authorHint: payload.authorHint,
    }),
  };
  const event = finalizeEvent(template, id.secretKey);
  const pool = new SimplePool();
  const relays = offerRelays();
  try {
    await Promise.race([
      Promise.allSettled(pool.publish(relays, event)),
      new Promise((_, reject) => setTimeout(() => reject(new Error("relay timeout")), 8000)),
    ]);
    return event.id;
  } finally {
    pool.close(relays);
  }
}

export async function publishEncryptedNotice(theirNpubOrHex: string, plaintext: string) {
  const id = loadIdentity();
  if (!id) return;
  const theirHex = parseNpub(theirNpubOrHex);
  const ciphertext = encryptNip44(plaintext, theirHex, id.secretKey);
  const template: EventTemplate = {
    kind: 14,
    created_at: Math.floor(Date.now() / 1000),
    tags: [["p", theirHex], ["client", "mecuadra"]],
    content: ciphertext,
  };
  const event = finalizeEvent(template, id.secretKey);
  const pool = new SimplePool();
  const relays = offerRelays();
  try {
    await Promise.allSettled(pool.publish(relays, event));
  } catch {
    /* best-effort */
  } finally {
    pool.close(relays);
  }
}
