import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { schnorr } from "@noble/curves/secp256k1.js";
import { bech32m } from "@scure/base";
import type { LocalNostrIdentity } from "./nostr/keys";

const HRP = "sp";

function tagged(tag: string, ...chunks: Uint8Array[]) {
  const t = sha256(new TextEncoder().encode(tag));
  const parts = [t, t, ...chunks];
  const len = parts.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(len);
  let o = 0;
  for (const c of parts) {
    out.set(c, o);
    o += c.length;
  }
  return sha256(out);
}

/** BIP-352-style scan + spend keys derived from the same nsec (demo-complete, not a full light client). */
export function silentPaymentKeys(secretKey: Uint8Array) {
  const scanSk = tagged("BIP0352/scan", secretKey);
  const spendSk = tagged("BIP0352/spend", secretKey);
  const scanPk = schnorr.getPublicKey(scanSk);
  const spendPk = schnorr.getPublicKey(spendSk);
  return { scanSk, spendSk, scanPk, spendPk };
}

export function silentPaymentCode(secretKey: Uint8Array) {
  const { scanPk, spendPk } = silentPaymentKeys(secretKey);
  const payload = new Uint8Array(1 + scanPk.length + spendPk.length);
  payload[0] = 0;
  payload.set(scanPk, 1);
  payload.set(spendPk, 1 + scanPk.length);
  return bech32m.encode(HRP, bech32m.toWords(payload), 200);
}

export function identitySilentPayment(id: LocalNostrIdentity) {
  return silentPaymentCode(id.secretKey);
}

/**
 * Unique shared secret per counterparty — same idea as Silent Payments:
 * one static code, many unlinkable conversations.
 */
export function matchSharedSecret(mySecret: Uint8Array, theirScanOrPubHex: string) {
  const their = theirScanOrPubHex.length === 64
    ? hexToBytesSafe(theirScanOrPubHex)
    : schnorr.getPublicKey(hexToBytesSafe(theirScanOrPubHex));
  const { scanSk } = silentPaymentKeys(mySecret);
  return bytesToHex(hmac(sha256, scanSk, their));
}

function hexToBytesSafe(hex: string) {
  const clean = hex.replace(/^0x/, "");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}

export { tagged as spTaggedHash };
