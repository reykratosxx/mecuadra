import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createHmac, randomBytes } from "crypto";

export const runtime = "nodejs";

function mac(payload: string) {
  const secret = process.env.CASHU_DEMO_SECRET || process.env.MESSAGE_ENCRYPTION_KEY || "mecuadra-demo";
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const nonce = randomBytes(16).toString("hex");
  const createdAt = new Date().toISOString();
  const payload = `${user.id}|1|publish-antispam|${nonce}|${createdAt}`;
  const stamp = {
    mint: process.env.NEXT_PUBLIC_CASHU_MINT_URL || "https://testnut.cashu.space",
    amount: 1,
    purpose: "publish-antispam" as const,
    demo: true,
    createdAt,
    proofsJson: JSON.stringify({ nonce, mac: mac(payload) }),
  };

  return NextResponse.json(stamp);
}

export async function GET() {
  return NextResponse.json({
    mint: process.env.NEXT_PUBLIC_CASHU_MINT_URL || "https://testnut.cashu.space",
    amount: 1,
    purpose: "publish-antispam",
    note: "One sat-token to publish. Never a price for the swapped goods. Lightning invoices here are signaling / minting, not barter settlement.",
  });
}
