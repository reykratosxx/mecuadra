import { v2 as nip44 } from "nostr-tools/nip44";
import { loadSecretKey } from "./keys";

const PREFIX = "nip44v2";

export function conversationKey(theirPubkeyHex: string, secretKey?: Uint8Array) {
  const sk = secretKey ?? loadSecretKey();
  if (!sk) throw new Error("No local nsec — NIP-44 needs a key in this browser.");
  return nip44.utils.getConversationKey(sk, theirPubkeyHex);
}

export function encryptNip44(plaintext: string, theirPubkeyHex: string, secretKey?: Uint8Array) {
  const key = conversationKey(theirPubkeyHex, secretKey);
  return `${PREFIX}.${nip44.encrypt(plaintext, key)}`;
}

export function decryptNip44(payload: string, theirPubkeyHex: string, secretKey?: Uint8Array) {
  const key = conversationKey(theirPubkeyHex, secretKey);
  const body = payload.startsWith(`${PREFIX}.`) ? payload.slice(PREFIX.length + 1) : payload;
  return nip44.decrypt(body, key);
}

export function isNip44Payload(payload: string) {
  return payload.startsWith(`${PREFIX}.`);
}
