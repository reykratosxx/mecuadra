import { NextResponse } from "next/server";
import { telegramConfigured, verifyTelegramInitData } from "@/lib/telegram";
import { establishTelegramSession } from "@/lib/telegram-auth";

export const runtime = "nodejs";

/** Login desde la Mini App de Telegram (initData firmado por Telegram). */
export async function POST(request: Request) {
  if (!telegramConfigured()) {
    return NextResponse.json({ error: "Telegram no está configurado." }, { status: 500 });
  }

  let body: { initData?: string };
  try {
    body = (await request.json()) as { initData?: string };
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const user = verifyTelegramInitData(String(body.initData || ""));
  if (!user) {
    return NextResponse.json(
      { error: "Telegram no validó esta sesión. Ábrela desde el bot otra vez." },
      { status: 401 },
    );
  }

  const result = await establishTelegramSession({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    photo_url: user.photo_url,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true, userId: result.userId });
}
