pragma circom 2.0.0;

include "circomlib/circuits/sha256/sha256.circom";
include "circomlib/circuits/bitify.circom";

/*
  Same public interface as BitVM/bitvm-circom-example test_circuit.circom
  https://github.com/BitVM/bitvm-circom-example

  Private: 256 bits.
  Public: SHA256 split into two 128-bit field elements.

  That 2-output shape is what their Bitcoin Script fflonk verifier was tested against
  (BitVM/BitVM#69: two public inputs). We keep this file so the proving pipeline
  (`snarkjs fflonk setup|prove|verify`) matches theirs before plugging reputation.circom.
*/

template Sha256Split() {
    signal input in[256];
    signal output out_1;
    signal output out_2;

    component sha256 = Sha256(256);
    sha256.in <== in;

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

component main = Sha256Split();
