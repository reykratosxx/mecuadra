import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, concatBytes, hexToBytes, randomBytes } from "@noble/hashes/utils.js";
import { schnorr, secp256k1_hasher } from "@noble/curves/secp256k1.js";

/**
 * Runtime badge: client-side validation (Pedersen + Chaum–Pedersen OR range proofs).
 * Circom/fflonk compression (two public SHA256 limbs) lives in circuits/, following
 * https://github.com/BitVM/bitvm-circom-example — Bitcoin Script does not run here.
 */
const ATTEST_KEY = "mecuadra_attestations";
const PROOF_KEY = "mecuadra_zk_proof";
export const DEFAULT_THRESHOLD = 1;
export const DEFAULT_MIN_RATING = 3;
export const PROTOCOL = "csv-pedersen-or-range" as const;

const Point = schnorr.Point;
const N = Point.Fn.ORDER;
const G = Point.BASE;
const enc = new TextEncoder();

export type Attestation = {
  tradeId: string;
  stars: number;
  fromPubkey: string;
  toPubkey: string;
  nonce: string;
  signature: string;
  createdAt: string;
};

export type RangeProof = {
  commitment: string;
  A: string[];
  c: string[];
  s: string[];
};

export type ReputationProof = {
  protocol: typeof PROTOCOL;
  curve: "secp256k1";
  model: "client-side-validation";
  circuit: "circuits/reputation.circom";
  publicSignals: {
    aggregate: string;
    threshold: number;
    minRating: number;
    nullifier: string;
    count: number;
  };
  rangeProofs: RangeProof[];
  createdAt: string;
};

const ZERO = BigInt(0);
const EIGHT = BigInt(8);

function modN(x: bigint) {
  const r = x % N;
  return r < ZERO ? r + N : r;
}

function randScalar() {
  let k = ZERO;
  while (k === ZERO) k = modN(bytesToNumberBE(randomBytes(32)));
  return k;
}

function bytesToNumberBE(bytes: Uint8Array) {
  let n = ZERO;
  for (const b of bytes) n = (n << EIGHT) | BigInt(b);
  return n;
}

function numberToBytesBE(n: bigint, len: number) {
  return hexToBytes(n.toString(16).padStart(len * 2, "0"));
}

function scalarHex(n: bigint) {
  return bytesToHex(numberToBytesBE(modN(n), 32));
}

function scalarFromHex(hex: string) {
  return modN(bytesToNumberBE(hexToBytes(hex)));
}

function mul(P: typeof G, k: bigint) {
  if (k === ZERO) return Point.ZERO;
  return P.multiply(k);
}

let cachedH: typeof G | null = null;
function pedersenH() {
  if (cachedH) return cachedH;
  const hashed = secp256k1_hasher.hashToCurve(enc.encode("mecuadra/pedersen/H/v1"));
  cachedH = Point.fromBytes(hashed.toBytes(true));
  return cachedH;
}

function commit(stars: number, blinding: bigint) {
  return mul(G, BigInt(stars)).add(mul(pedersenH(), blinding));
}

function hashToScalar(...chunks: Uint8Array[]) {
  return modN(bytesToNumberBE(sha256(concatBytes(...chunks))));
}

function poseidonish(...hexes: string[]) {
  let acc = enc.encode("mecuadra/poseidonish/v1");
  for (const h of hexes) {
    acc = sha256(concatBytes(acc, enc.encode(h)));
  }
  return bytesToHex(acc);
}

export function loadAttestations(): Attestation[] {
  try {
    const raw = localStorage.getItem(ATTEST_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Attestation[];
  } catch {
    return [];
  }
}

export function saveAttestations(list: Attestation[]) {
  localStorage.setItem(ATTEST_KEY, JSON.stringify(list));
}

export function buildAttestation(input: {
  secretKey: Uint8Array;
  tradeId: string;
  stars: number;
  fromPubkey: string;
  toPubkey: string;
}): Attestation {
  const nonce = bytesToHex(randomBytes(16));
  const msg = hexToBytes(poseidonish(input.tradeId, String(input.stars), input.fromPubkey, input.toPubkey, nonce));
  const signature = bytesToHex(schnorr.sign(msg, input.secretKey));
  return {
    tradeId: input.tradeId,
    stars: input.stars,
    fromPubkey: input.fromPubkey,
    toPubkey: input.toPubkey,
    nonce,
    signature,
    createdAt: new Date().toISOString(),
  };
}

export function issueAttestation(input: {
  secretKey: Uint8Array;
  tradeId: string;
  stars: number;
  fromPubkey: string;
  toPubkey: string;
}): Attestation {
  const att = buildAttestation(input);
  const next = [...loadAttestations().filter((a) => a.tradeId !== att.tradeId), att];
  saveAttestations(next);
  return att;
}

function ratingsFor(kLo: number, kHi: number) {
  const out: number[] = [];
  for (let k = kLo; k <= kHi; k++) out.push(k);
  return out;
}

/** Chaum–Pedersen OR: C = kG + rH for some k in [kLo, kHi]. Stars stay hidden. */
function proveRange(stars: number, blinding: bigint, kLo: number, kHi: number): RangeProof {
  const ks = ratingsFor(kLo, kHi);
  const H = pedersenH();
  const C = commit(stars, blinding);
  const Cbytes = C.toBytes(true);
  const A: (typeof G)[] = new Array(ks.length);
  const challenges: bigint[] = new Array(ks.length);
  const responses: bigint[] = new Array(ks.length);
  const trueIdx = ks.indexOf(stars);
  if (trueIdx < 0) throw new Error("STARS_OUT_OF_RANGE");

  const w = randScalar();
  for (let i = 0; i < ks.length; i++) {
    if (i === trueIdx) {
      A[i] = mul(H, w);
      continue;
    }
    const ci = randScalar();
    const si = randScalar();
    const Ci = C.subtract(mul(G, BigInt(ks[i])));
    A[i] = mul(H, si).subtract(mul(Ci, ci));
    challenges[i] = ci;
    responses[i] = si;
  }

  const transcript = hashToScalar(
    enc.encode("mecuadra/or-range/v1"),
    Cbytes,
    ...A.map((p) => p.toBytes(true)),
  );
  let fakeSum = ZERO;
  for (let i = 0; i < ks.length; i++) {
    if (i !== trueIdx) fakeSum = modN(fakeSum + challenges[i]);
  }
  challenges[trueIdx] = modN(transcript - fakeSum);
  responses[trueIdx] = modN(w + challenges[trueIdx] * blinding);

  return {
    commitment: bytesToHex(Cbytes),
    A: A.map((p) => bytesToHex(p.toBytes(true))),
    c: challenges.map(scalarHex),
    s: responses.map(scalarHex),
  };
}

function verifyRange(proof: RangeProof, kLo: number, kHi: number) {
  const ks = ratingsFor(kLo, kHi);
  if (proof.A.length !== ks.length || proof.c.length !== ks.length || proof.s.length !== ks.length) {
    return false;
  }
  let C: typeof G;
  try {
    C = Point.fromBytes(hexToBytes(proof.commitment));
  } catch {
    return false;
  }
  const H = pedersenH();
  const As: (typeof G)[] = [];
  let cSum = ZERO;
  for (let i = 0; i < ks.length; i++) {
    let Ai: typeof G;
    try {
      Ai = Point.fromBytes(hexToBytes(proof.A[i]));
    } catch {
      return false;
    }
    As.push(Ai);
    const ci = scalarFromHex(proof.c[i]);
    const si = scalarFromHex(proof.s[i]);
    cSum = modN(cSum + ci);
    const Ci = C.subtract(mul(G, BigInt(ks[i])));
    const rhs = Ai.add(mul(Ci, ci));
    if (!mul(H, si).equals(rhs)) return false;
  }
  const transcript = hashToScalar(
    enc.encode("mecuadra/or-range/v1"),
    C.toBytes(true),
    ...As.map((p) => p.toBytes(true)),
  );
  return cSum === transcript;
}

export function proveFromAttestations(
  secretKey: Uint8Array,
  pubkeyHex: string,
  attestations: Attestation[],
  opts?: { threshold?: number; minRating?: number; persist?: boolean },
): ReputationProof {
  const threshold = opts?.threshold ?? DEFAULT_THRESHOLD;
  const minRating = opts?.minRating ?? DEFAULT_MIN_RATING;
  const mine = attestations.filter(
    (a) => a.toPubkey === pubkeyHex && a.fromPubkey !== pubkeyHex && a.stars >= minRating && a.stars <= 5,
  );
  if (mine.length < threshold) {
    throw new Error("INSUFFICIENT_ATTESTATIONS");
  }
  for (const a of mine) {
    const msg = hexToBytes(poseidonish(a.tradeId, String(a.stars), a.fromPubkey, a.toPubkey, a.nonce));
    if (!schnorr.verify(hexToBytes(a.signature), msg, hexToBytes(a.fromPubkey))) {
      throw new Error("BAD_ATTESTATION_SIG");
    }
  }

  const rangeProofs = mine.map((a) => proveRange(a.stars, randScalar(), minRating, 5));
  let aggregate = Point.ZERO;
  for (const rp of rangeProofs) {
    aggregate = aggregate.add(Point.fromBytes(hexToBytes(rp.commitment)));
  }

  const proof: ReputationProof = {
    protocol: PROTOCOL,
    curve: "secp256k1",
    model: "client-side-validation",
    circuit: "circuits/reputation.circom",
    publicSignals: {
      aggregate: bytesToHex(aggregate.toBytes(true)),
      threshold,
      minRating,
      nullifier: poseidonish(bytesToHex(secretKey), "1"),
      count: mine.length,
    },
    rangeProofs,
    createdAt: new Date().toISOString(),
  };
  if (opts?.persist !== false) {
    localStorage.setItem(PROOF_KEY, JSON.stringify(proof));
  }
  return proof;
}

export function proveReputation(
  secretKey: Uint8Array,
  pubkeyHex: string,
  opts?: { threshold?: number; minRating?: number },
): ReputationProof {
  return proveFromAttestations(secretKey, pubkeyHex, loadAttestations(), opts);
}

export function parseReputationProof(raw: unknown): ReputationProof | null {
  if (!raw || typeof raw !== "object") return null;
  const proof = raw as ReputationProof;
  if (proof.protocol !== PROTOCOL || !Array.isArray(proof.rangeProofs) || !proof.publicSignals) {
    return null;
  }
  return proof;
}

export function loadStoredProof(): ReputationProof | null {
  try {
    const raw = localStorage.getItem(PROOF_KEY);
    return raw ? (JSON.parse(raw) as ReputationProof) : null;
  } catch {
    return null;
  }
}

/**
 * Client-side validation (RGB / zkCoins model): Bitcoin Script does not verify this.
 * Verifiers check Pedersen range proofs. They never learn counterparties or exact stars.
 */
export function verifyReputationProof(proof: ReputationProof, expectedNullifier?: string) {
  if (proof.protocol !== PROTOCOL) return false;
  if (proof.model !== "client-side-validation") return false;
  const { threshold, minRating, count, aggregate, nullifier } = proof.publicSignals;
  if (count < threshold || proof.rangeProofs.length !== count) return false;
  if (expectedNullifier && expectedNullifier !== nullifier) return false;
  let sum = Point.ZERO;
  for (const rp of proof.rangeProofs) {
    if (!verifyRange(rp, minRating, 5)) return false;
    try {
      sum = sum.add(Point.fromBytes(hexToBytes(rp.commitment)));
    } catch {
      return false;
    }
  }
  try {
    return sum.equals(Point.fromBytes(hexToBytes(aggregate)));
  } catch {
    return false;
  }
}

export function nullifierFor(secretKey: Uint8Array) {
  return poseidonish(bytesToHex(secretKey), "1");
}
