import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { generateSecretKey, getPublicKey } from "nostr-tools/pure";
import { nsecEncode, npubEncode, decode as nip19Decode } from "nostr-tools/nip19";

export const NSEC_STORAGE_KEY = "mecuadra_nsec";
export const NPUB_STORAGE_KEY = "mecuadra_npub";

export type LocalNostrIdentity = {
  secretKey: Uint8Array;
  pubkey: string;
  nsec: string;
  npub: string;
};

export function createIdentity(): LocalNostrIdentity {
  const secretKey = generateSecretKey();
  return identityFromSecret(secretKey);
}

export function identityFromSecret(secretKey: Uint8Array): LocalNostrIdentity {
  const pubkey = getPublicKey(secretKey);
  return {
    secretKey,
    pubkey,
    nsec: nsecEncode(secretKey),
    npub: npubEncode(pubkey),
  };
}

export function parseNsec(input: string): Uint8Array {
  const trimmed = input.trim();
  if (/^[0-9a-f]{64}$/i.test(trimmed)) return hexToBytes(trimmed);
  const decoded = nip19Decode(trimmed);
  if (decoded.type !== "nsec") throw new Error("Not an nsec");
  return decoded.data as Uint8Array;
}

export function parseNpub(input: string): string {
  const trimmed = input.trim();
  if (/^[0-9a-f]{64}$/i.test(trimmed)) return trimmed.toLowerCase();
  const decoded = nip19Decode(trimmed);
  if (decoded.type !== "npub") throw new Error("Not an npub");
  return decoded.data as string;
}

export function saveIdentity(id: LocalNostrIdentity) {
  try {
    localStorage.setItem(NSEC_STORAGE_KEY, bytesToHex(id.secretKey));
    localStorage.setItem(NPUB_STORAGE_KEY, id.npub);
  } catch {
    /* private mode */
  }
}

export function loadSecretKey(): Uint8Array | null {
  try {
    const hex = localStorage.getItem(NSEC_STORAGE_KEY);
    if (!hex || hex.length !== 64) return null;
    return hexToBytes(hex);
  } catch {
    return null;
  }
}

export function loadIdentity(): LocalNostrIdentity | null {
  const sk = loadSecretKey();
  if (!sk) return null;
  return identityFromSecret(sk);
}

export function clearIdentity() {
  try {
    localStorage.removeItem(NSEC_STORAGE_KEY);
    localStorage.removeItem(NPUB_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function shortNpub(npub: string) {
  if (npub.length < 16) return npub;
  return `${npub.slice(0, 10)}…${npub.slice(-8)}`;
}

export function nostrAuthEmail(pubkeyHex: string) {
  return `npub_${pubkeyHex.slice(0, 16)}@nostr.mecuadra.app`;
}
