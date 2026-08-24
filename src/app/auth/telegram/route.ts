import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
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

function siteOrigin(request: Request) {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (env) return env;
  return new URL(request.url).origin;
}

/**
 * Callback del Login Widget en modo redirect (mejor con VPN / iframes bloqueados).
 * Telegram redirige aquí con query params id, first_name, hash, …
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const nextParam = url.searchParams.get("next");
  const safeNext = nextParam && nextParam.startsWith("/") ? nextParam : "/explorar";
  const origin = siteOrigin(request);
  const fail = (msg: string) =>
    NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(msg)}&next=${encodeURIComponent(safeNext)}`,
    );

  const raw = Object.fromEntries(url.searchParams.entries());
  delete raw.next;
  const body = coerceTelegramLogin(raw);
  if (!body) return fail("Datos de Telegram incompletos.");

  if (!process.env.TELEGRAM_BOT_TOKEN) return fail("Falta TELEGRAM_BOT_TOKEN.");

  if (!verifyTelegramLogin(body)) {
    return fail("La sesión de Telegram no es válida o caducó. Prueba sin VPN.");
  }

  try {
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
      return fail(linkErr?.message || "No se pudo abrir la sesión.");
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

    // Cookies deben ir en el mismo NextResponse.redirect (no en cookies() suelto).
    const redirect = NextResponse.redirect(`${origin}${safeNext}`);
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.headers
              .get("cookie")
              ?.split(";")
              .map((c) => {
                const [name, ...rest] = c.trim().split("=");
                return { name, value: rest.join("=") };
              })
              .filter((c) => c.name) ?? [];
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              redirect.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const { error: sessionErr } = await supabase.auth.verifyOtp({
      type: "email",
      token_hash: link.properties.hashed_token,
    });

    if (sessionErr) return fail(sessionErr.message);

    return redirect;
  } catch {
    return fail("Error al iniciar sesión. Inténtalo de nuevo o desactiva la VPN.");
  }
}
