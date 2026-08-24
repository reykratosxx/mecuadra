import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  coerceTelegramLogin,
  telegramAuthEmail,
  verifyTelegramLogin,
  type TelegramLoginPayload,
} from "@/lib/telegram";

export const runtime = "nodejs";

function displayName(data: TelegramLoginPayload) {
  return [data.first_name, data.last_name].filter(Boolean).join(" ").trim() || data.username || `tg${data.id}`;
}

function usernameFromTg(data: TelegramLoginPayload) {
  const raw = (data.username || `tg${data.id}`).toLowerCase().replace(/[^a-z0-9_]/g, "");
  return raw.slice(0, 24) || `tg${data.id}`;
}

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

  const admin = createAdminClient();
  const email = telegramAuthEmail(body.id);
  const name = displayName(body);
  const username = usernameFromTg(body);
  const avatar = body.photo_url || null;

  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("telegram_id", body.id)
    .maybeSingle();

  if (!existing) {
    await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        telegram_id: body.id,
        full_name: name,
        name,
        user_name: username,
        avatar_url: avatar,
        telegram_username: body.username ?? null,
      },
    });
  }

  const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (linkErr || !link.properties?.hashed_token || !link.user?.id) {
    return NextResponse.json(
      { error: linkErr?.message || "No se pudo abrir la sesión." },
      { status: 500 },
    );
  }

  const userId = link.user.id;

  await admin
    .from("profiles")
    .update({
      telegram_id: body.id,
      name,
      avatar_url: avatar,
      phone_verified: true,
      verified: true,
    })
    .eq("id", userId);

  const { data: profile } = await admin.from("profiles").select("id").eq("id", userId).maybeSingle();
  if (!profile) {
    const uniq = `${username}_${String(body.id).slice(-4)}`;
    await admin.from("profiles").insert({
      id: userId,
      username: uniq.slice(0, 24),
      name,
      avatar_url: avatar,
      telegram_id: body.id,
      phone_verified: true,
      verified: true,
    });
  }

  const supabase = await createClient();
  const { error: sessionErr } = await supabase.auth.verifyOtp({
    type: "email",
    token_hash: link.properties.hashed_token,
  });

  if (sessionErr) {
    return NextResponse.json({ error: sessionErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, userId });
}
