import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { telegramBotUsername, telegramConfigured } from "@/lib/telegram";
import { establishTelegramSession } from "@/lib/telegram-auth";

export const runtime = "nodejs";

const MAX_AGE_MS = 15 * 60 * 1000;

/** Crea una sesión de login y el enlace t.me/bot?start=login_TOKEN */
export async function POST() {
  if (!telegramConfigured()) {
    return NextResponse.json({ error: "Telegram no está configurado." }, { status: 500 });
  }

  const token = randomBytes(16).toString("hex");
  const admin = createAdminClient();
  const { error } = await admin.from("telegram_auth_sessions").insert({
    token,
    status: "pending",
  });

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message.includes("telegram_auth_sessions")
            ? "Falta la tabla telegram_auth_sessions en Supabase. Ejecuta el SQL del schema."
            : error.message,
      },
      { status: 500 },
    );
  }

  const bot = telegramBotUsername();
  return NextResponse.json({
    token,
    url: `https://t.me/${bot}?start=login_${token}`,
  });
}

/** Poll: ¿ya confirmó en el bot? */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim();
  if (!token || !/^[a-f0-9]{32}$/.test(token)) {
    return NextResponse.json({ error: "Token inválido." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("telegram_auth_sessions")
    .select("status, telegram_id, first_name, last_name, username, photo_url, created_at")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Sesión no encontrada." }, { status: 404 });
  }

  // La fila se borra cuando el usuario responde “No fui yo” en el bot.
  if (!data) {
    return NextResponse.json({ status: "cancelled" });
  }

  const age = Date.now() - new Date(data.created_at as string).getTime();
  if (age > MAX_AGE_MS) {
    return NextResponse.json({ status: "expired" });
  }

  if (data.status === "pending") {
    return NextResponse.json({ status: "pending" });
  }

  if (data.status === "consumed") {
    return NextResponse.json({ status: "consumed" });
  }

  if (data.status !== "confirmed" || !data.telegram_id) {
    return NextResponse.json({ status: "pending" });
  }

  return NextResponse.json({
    status: "confirmed",
    user: {
      id: data.telegram_id,
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      photo_url: data.photo_url,
    },
  });
}

/** Completa la sesión web tras confirmar en el bot. */
export async function PUT(request: Request) {
  let body: { token?: string };
  try {
    body = (await request.json()) as { token?: string };
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const token = body.token?.trim();
  if (!token || !/^[a-f0-9]{32}$/.test(token)) {
    return NextResponse.json({ error: "Token inválido." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("telegram_auth_sessions")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Sesión no encontrada." }, { status: 404 });
  }

  const age = Date.now() - new Date(data.created_at as string).getTime();
  if (age > MAX_AGE_MS) {
    return NextResponse.json({ error: "El enlace caducó. Empieza de nuevo." }, { status: 410 });
  }

  if (data.status === "consumed") {
    return NextResponse.json({ ok: true, already: true });
  }

  if (data.status !== "confirmed" || !data.telegram_id) {
    return NextResponse.json(
      { error: "Aún no confirmaste en Telegram. Toca “Sí, iniciar sesión” en el chat del bot." },
      { status: 409 },
    );
  }

  const result = await establishTelegramSession({
    id: Number(data.telegram_id),
    first_name: data.first_name ?? undefined,
    last_name: data.last_name ?? undefined,
    username: data.username ?? undefined,
    photo_url: data.photo_url ?? undefined,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  await admin
    .from("telegram_auth_sessions")
    .update({ status: "consumed" })
    .eq("token", token);

  return NextResponse.json({ ok: true, userId: result.userId });
}
