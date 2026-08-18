import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { decryptMessage, encryptMessage } from "@/lib/crypto";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: trade } = await supabase
    .from("trades")
    .select("id, owner_id, applicant_id")
    .eq("id", id)
    .maybeSingle();
  if (!trade || (trade.owner_id !== user.id && trade.applicant_id !== user.id)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("messages")
    .select("id, trade_id, sender_id, ciphertext, created_at")
    .eq("trade_id", id)
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const messages = (data ?? []).map((row) => {
    let text = "";
    try {
      text = decryptMessage(row.ciphertext);
    } catch {
      text = "[mensaje no disponible]";
    }
    return {
      id: row.id,
      tradeId: row.trade_id,
      senderId: row.sender_id,
      text,
      createdAt: row.created_at,
    };
  });

  return NextResponse.json({ messages });
}

export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = (await req.json()) as { text?: string };
  const text = body.text?.trim() ?? "";
  if (!text || text.length > 600) {
    return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: trade } = await supabase
    .from("trades")
    .select("id, owner_id, applicant_id, status")
    .eq("id", id)
    .maybeSingle();
  if (!trade || (trade.owner_id !== user.id && trade.applicant_id !== user.id)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  if (!["pendiente", "aceptado", "entregado"].includes(trade.status)) {
    return NextResponse.json({ error: "Este trueque ya no admite mensajes" }, { status: 409 });
  }

  const ciphertext = encryptMessage(text);
  const { data, error } = await supabase
    .from("messages")
    .insert({ trade_id: id, sender_id: user.id, ciphertext })
    .select("id, created_at")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({
    message: {
      id: data.id,
      tradeId: id,
      senderId: user.id,
      text,
      createdAt: data.created_at,
    },
  });
}
