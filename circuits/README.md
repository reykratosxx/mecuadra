# ZK circuits — BitVM fflonk path

Runtime reputation in the app is **client-side validation** (Pedersen commitments + OR range proofs). Bitcoin Script does not run that.

The SNARK path follows [BitVM/bitvm-circom-example](https://github.com/BitVM/bitvm-circom-example) exactly: Circom → witness → **fflonk** (not Groth16) → `public.json` with **two** field elements.

That example circuit (`test_circuit.circom`) hashes 256 private bits with SHA256 and splits the digest into `out_1` / `out_2`. Their Bitcoin Script fflonk verifier was tested with two public inputs ([BitVM#69](https://github.com/BitVM/BitVM/pull/69)).

| File | Role |
| --- | --- |
| `bitvm_sha256_split.circom` | Same SHA256-split interface as their `test_circuit.circom` |
| `reputation.circom` | Private attestations + the same two public outputs |
| `input.example.json` | Witness for `reputation.circom` |

`circomlib` is not vendored. Clone it next to these files:

```bash
git clone --depth 1 https://github.com/iden3/circomlib.git circuits/circomlib
```

Hermez ptau (same URL as BitVM):

```bash
# https://github.com/iden3/snarkjs — powersOfTau28_hez_final_21.ptau
```

Then the BitVM README steps, with our circuit names:

```bash
circom circuits/reputation.circom --r1cs --wasm --sym -o build
cd build/reputation_js
node generate_witness.js reputation.wasm ../../circuits/input.example.json ../witness.wtns
cd ../..
snarkjs wtns check build/reputation.r1cs build/witness.wtns
snarkjs fflonk setup build/reputation.r1cs powersOfTau28_hez_final_21.ptau build/reputation.zkey
snarkjs zkey export verificationkey build/reputation.zkey public/zk/verification_key.json
snarkjs fflonk prove build/reputation.zkey build/witness.wtns proof.json public.json
snarkjs fflonk verify public/zk/verification_key.json public.json proof.json
```

`public.json` must be two numbers (`out_1`, `out_2`), like [their public.json](https://github.com/BitVM/bitvm-circom-example/blob/master/public.json).

BitVM2 later shipped a Groth16 Script verifier (~1 GB, optimistic). This fork does not execute that script. The badge in the profile is the Pedersen CSV verifier in `src/lib/zk/reputation.ts`.
