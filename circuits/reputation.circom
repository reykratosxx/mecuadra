pragma circom 2.0.0;

include "circomlib/circuits/sha256/sha256.circom";
include "circomlib/circuits/bitify.circom";
include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";

/*
  ProveReputation — BitVM-shaped public interface + private attestations

  The shipped app verifies Pedersen range proofs in the browser (client-side
  validation, RGB/zkCoins style). This circuit is the SNARK compression path
  following BitVM/bitvm-circom-example:

    https://github.com/BitVM/bitvm-circom-example

  That repo does NOT verify Groth16 on L1. It compiles a Circom circuit and
  proves it with **fflonk** (snarkjs fflonk setup/prove/verify, Hermez ptau).
  The Bitcoin Script verifier they tested accepts **two public field elements**.

  We therefore expose only:
    out_1, out_2 = SHA256( Poseidon(nullifier, merkleRoot, threshold, minRatingX10) as 256 bits )
  split into two 128-bit numbers — the same split as their test_circuit.circom.

  Private: identitySecret, stars, fromPkHash, tradeNonce.
  Counterparties never appear as public signals.

  Compile / prove (same steps as BitVM's README):

    git clone --depth 1 https://github.com/iden3/circomlib.git circuits/circomlib
    circom circuits/reputation.circom --r1cs --wasm --sym -o build
    snarkjs fflonk setup build/reputation.r1cs powersOfTau28_hez_final_21.ptau build/reputation.zkey
    snarkjs zkey export verificationkey build/reputation.zkey public/zk/verification_key.json
    snarkjs fflonk prove build/reputation.zkey witness.wtns proof.json public.json
    snarkjs fflonk verify public/zk/verification_key.json public.json proof.json

  BitVM2 later shipped a Groth16 Bitcoin Script verifier (~1 GB, optimistic).
  We do not claim that script runs in this app.
*/

template ProveReputation(n) {
    signal input identitySecret;
    signal input stars[n];
    signal input fromPkHash[n];
    signal input tradeNonce[n];
    signal input threshold;
    signal input minRatingX10;

    signal output out_1;
    signal output out_2;

    component poseidonNull = Poseidon(2);
    poseidonNull.inputs[0] <== identitySecret;
    poseidonNull.inputs[1] <== 1;
    signal nullifier;
    nullifier <== poseidonNull.out;

    var sum = 0;
    component leaves[n];
    component chain[n];
    component gteStar[n];
    component lteStar[n];
    signal acc[n + 1];
    acc[0] <== 0;

    for (var i = 0; i < n; i++) {
        gteStar[i] = GreaterEqThan(8);
        gteStar[i].in[0] <== stars[i];
        gteStar[i].in[1] <== 1;
        gteStar[i].out === 1;

        lteStar[i] = LessEqThan(8);
        lteStar[i].in[0] <== stars[i];
        lteStar[i].in[1] <== 5;
        lteStar[i].out === 1;

        sum += stars[i];
        leaves[i] = Poseidon(4);
        leaves[i].inputs[0] <== stars[i];
        leaves[i].inputs[1] <== fromPkHash[i];
        leaves[i].inputs[2] <== tradeNonce[i];
        leaves[i].inputs[3] <== identitySecret;
        chain[i] = Poseidon(2);
        chain[i].inputs[0] <== acc[i];
        chain[i].inputs[1] <== leaves[i].out;
        acc[i + 1] <== chain[i].out;
    }

    signal merkleRoot;
    merkleRoot <== acc[n];

    component gteN = GreaterEqThan(8);
    gteN.in[0] <== n;
    gteN.in[1] <== threshold;
    gteN.out === 1;

    signal avgX10;
    avgX10 <== sum * 10 / n;
    component gteAvg = GreaterEqThan(8);
    gteAvg.in[0] <== avgX10;
    gteAvg.in[1] <== minRatingX10;
    gteAvg.out === 1;

    component stmt = Poseidon(4);
    stmt.inputs[0] <== nullifier;
    stmt.inputs[1] <== merkleRoot;
    stmt.inputs[2] <== threshold;
    stmt.inputs[3] <== minRatingX10;

    component n2b = Num2Bits(254);
    n2b.in <== stmt.out;

    component sha256 = Sha256(256);
    for (var i = 0; i < 254; i++) {
        sha256.in[i] <== n2b.out[i];
    }
    sha256.in[254] <== 0;
    sha256.in[255] <== 0;

    component b2n_1 = Bits2Num(128);
    for (var i = 0; i < 128; i++) {
        b2n_1.in[i] <== sha256.out[i];
    }
    out_1 <== b2n_1.out;

    component b2n_2 = Bits2Num(128);
    for (var i = 0; i < 128; i++) {
        b2n_2.in[i] <== sha256.out[128 + i];
    }
    out_2 <== b2n_2.out;
}

component main = ProveReputation(4);
