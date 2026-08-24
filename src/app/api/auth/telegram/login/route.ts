import { NextResponse } from "next/server";
import {
  coerceTelegramLogin,
  verifyTelegramLogin,
} from "@/lib/telegram";
import { establishTelegramSession } from "@/lib/telegram-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const body = coerceTelegramLogin(raw);
  if (!body) {
    return NextResponse.json({ error: "Datos de Telegram incompletos." }, { status: 400 });
  }

  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return NextResponse.json({ error: "Falta TELEGRAM_BOT_TOKEN en el servidor." }, { status: 500 });
  }

  if (!verifyTelegramLogin(body)) {
    return NextResponse.json(
      {
        error:
          "La sesión de Telegram no es válida o caducó. Si usas VPN, desactívala e inténtalo de nuevo.",
      },
      { status: 401 },
    );
  }

  const result = await establishTelegramSession(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true, userId: result.userId });
}
