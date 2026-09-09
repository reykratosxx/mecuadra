import { NextResponse } from "next/server";
import type { Event } from "nostr-tools/pure";
import { assertLoginEvent, establishNostrSession } from "@/lib/nostr-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { event?: Event; silentPayment?: string };
  try {
    body = (await request.json()) as { event?: Event; silentPayment?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const event = body.event;
  if (!event || typeof event.pubkey !== "string") {
    return NextResponse.json({ error: "Missing signed Nostr event." }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const bad = assertLoginEvent(event, origin);
  if (bad) return NextResponse.json({ error: bad }, { status: 401 });

  try {
    const result = await establishNostrSession(event.pubkey, body.silentPayment);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ ok: true, userId: result.userId, npub: result.npub });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Nostr login failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
