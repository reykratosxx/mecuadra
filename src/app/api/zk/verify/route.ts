import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createHmac, randomBytes } from "crypto";
import { verifyReputationProof, type ReputationProof } from "@/lib/zk/reputation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  let proof: ReputationProof;
  try {
    proof = (await request.json()) as ReputationProof;
  } catch {
    return NextResponse.json({ error: "Invalid proof JSON." }, { status: 400 });
  }

  if (!verifyReputationProof(proof)) {
    return NextResponse.json({ error: "Proof failed public verification." }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      zk_proof: proof,
      zk_nullifier: proof.publicSignals.nullifier,
      verified: true,
    })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await supabase.from("zk_proofs").insert({
    user_id: user.id,
    nullifier: proof.publicSignals.nullifier,
    proof,
  });

  return NextResponse.json({ ok: true, publicSignals: proof.publicSignals });
}

export async function GET() {
  return NextResponse.json({
    circuit: "circuits/reputation.circom",
    bitvmExample: "https://github.com/BitVM/bitvm-circom-example",
    provingSystem: "fflonk (snarkjs), two public outputs — SHA256 split like BitVM test_circuit.circom",
    runtime: "client-side-validation: Pedersen commitments + OR range proofs (secp256k1)",
    note: "Bitcoin Script does not verify this in-app. BitVM's fflonk/Groth16 verifiers are optimistic and huge; we do not pretend they run here.",
  });
}

export function demoChallenge() {
  return randomBytes(16).toString("hex");
}

export function stampMac(payload: string) {
  const secret = process.env.CASHU_DEMO_SECRET || process.env.MESSAGE_ENCRYPTION_KEY || "mecuadra-demo";
  return createHmac("sha256", secret).update(payload).digest("hex");
}
