import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isNip44Payload } from "@/lib/nostr/nip44";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const { data: trade } = await supabase
    .from("trades")
    .select("id, owner_id, applicant_id")
    .eq("id", id)
    .maybeSingle();
  if (!trade || (trade.owner_id !== user.id && trade.applicant_id !== user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("messages")
    .select("id, trade_id, sender_id, ciphertext, created_at, scheme")
    .eq("trade_id", id)
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const messages = (data ?? []).map((row) => {
    const scheme = row.scheme === "legacy" || !isNip44Payload(row.ciphertext) && row.ciphertext.startsWith("v1.")
      ? "legacy"
      : "nip44";
    return {
      id: row.id,
      tradeId: row.trade_id,
      senderId: row.sender_id,
      text: "",
      ciphertext: row.ciphertext,
      scheme,
      createdAt: row.created_at,
    };
  });

  return NextResponse.json({ messages });
}

export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = (await req.json()) as { text?: string; ciphertext?: string; scheme?: string };
  const ciphertext = body.ciphertext?.trim() ?? "";
  const text = body.text?.trim() ?? "";
  if (!ciphertext && (!text || text.length > 600)) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }
  if (ciphertext.length > 8000) {
    return NextResponse.json({ error: "Ciphertext too large" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const { data: trade } = await supabase
    .from("trades")
    .select("id, owner_id, applicant_id, status")
    .eq("id", id)
    .maybeSingle();
  if (!trade || (trade.owner_id !== user.id && trade.applicant_id !== user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!["pendiente", "aceptado", "entregado"].includes(trade.status)) {
    return NextResponse.json({ error: "This trade no longer accepts messages" }, { status: 409 });
  }

  const stored = ciphertext || text;
  const scheme = ciphertext ? "nip44" : "legacy";
  const { data, error } = await supabase
    .from("messages")
    .insert({ trade_id: id, sender_id: user.id, ciphertext: stored, scheme })
    .select("id, created_at")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({
    message: {
      id: data.id,
      tradeId: id,
      senderId: user.id,
      text: ciphertext ? "" : text,
      ciphertext: stored,
      scheme,
      createdAt: data.created_at,
    },
  });
}
