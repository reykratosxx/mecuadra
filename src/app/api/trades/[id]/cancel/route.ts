import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

const CANCELABLE = ["pendiente", "aceptado", "entregado"];

/**
 * Marca un trueque como no completado. La oferta vuelve al mercado para que
 * otra persona pueda aplicar; el aplicante no puede tocar la oferta por RLS,
 * así que ese paso va con el cliente de servicio.
 */
export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  let reason = "";
  try {
    const body = (await req.json()) as { reason?: string };
    reason = (body.reason ?? "").trim().slice(0, 200);
  } catch {
    /* sin motivo */
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: trade } = await supabase
    .from("trades")
    .select("id, offer_id, owner_id, applicant_id, status")
    .eq("id", id)
    .maybeSingle();

  if (!trade || (trade.owner_id !== user.id && trade.applicant_id !== user.id)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  if (!CANCELABLE.includes(trade.status)) {
    return NextResponse.json(
      { error: "Este trueque ya está cerrado y no se puede marcar como no completado." },
      { status: 409 },
    );
  }

  const admin = createAdminClient();

  const { error: tradeErr } = await admin
    .from("trades")
    .update({
      status: "cancelado",
      owner_delivered: false,
      applicant_delivered: false,
    })
    .eq("id", id);
  if (tradeErr) return NextResponse.json({ error: tradeErr.message }, { status: 400 });

  const { data: offer } = await admin
    .from("offers")
    .select("id, status")
    .eq("id", trade.offer_id)
    .maybeSingle();

  let offerReopened = false;
  if (offer && offer.status === "en_proceso") {
    const { error: offerErr } = await admin
      .from("offers")
      .update({ status: "abierta" })
      .eq("id", offer.id);
    offerReopened = !offerErr;
  }

  const otherId = trade.owner_id === user.id ? trade.applicant_id : trade.owner_id;
  await admin.from("notifications").insert({
    user_id: otherId,
    title: "Trueque marcado como no completado",
    body: reason
      ? `La otra parte lo canceló: “${reason}”.`
      : "La otra parte avisó que no se pudo concretar. La oferta vuelve al mercado.",
    href: `/chat/${id}`,
  });

  return NextResponse.json({ ok: true, offerReopened });
}
