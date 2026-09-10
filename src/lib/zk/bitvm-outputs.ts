import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import type { ReputationProof } from "./reputation";

/**
 * Two public SHA256 limbs — the same *shape* BitVM’s fflonk Script verifier was
 * tested with (BitVM/bitvm-circom-example: out_1 / out_2).
 *
 * The Circom circuit hashes a Poseidon statement; this helper hashes the
 * published Pedersen public signals so the docs/UI can show two numbers a
 * future Script verifier would take. It is not a Bitcoin L1 check.
 */
export function bitvmLimbsFromProof(proof: ReputationProof) {
  const stmt = [
    proof.publicSignals.nullifier,
    proof.publicSignals.aggregate,
    String(proof.publicSignals.threshold),
    String(proof.publicSignals.minRating),
    String(proof.publicSignals.count),
  ].join("|");
  const digest = sha256(new TextEncoder().encode(`mecuadra/bitvm-limbs/v1|${stmt}`));
  return {
    out1: bytesToHex(digest.slice(0, 16)),
    out2: bytesToHex(digest.slice(16, 32)),
    digestHex: bytesToHex(digest),
  };
}
