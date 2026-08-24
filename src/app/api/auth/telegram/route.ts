import { createAdminClient } from "@/lib/supabase/admin";
import { isCubanMobile, normalizeCubanPhone } from "@/lib/phone";
import { shareContactKeyboard, telegramBotUsername, telegramSend } from "@/lib/telegram";

export const runtime = "nodejs";

type TgContact = { phone_number?: string; user_id?: number };
type TgChat = { id: number };
type TgFrom = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
};
type TgMessage = {
  chat?: TgChat;
  from?: TgFrom;
  text?: string;
  contact?: TgContact;
};
type TgUpdate = { message?: TgMessage };

function authorized(request: Request) {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) return true;
  return request.headers.get("x-telegram-bot-api-secret-token") === expected;
}

function siteOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://mecuadra.vercel.app").replace(/\/$/, "");
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return new Response("unauthorized", { status: 401 });
  }

  const update = (await request.json()) as TgUpdate;
  const msg = update.message;
  const chatId = msg?.chat?.id;
  if (!chatId) return Response.json({ ok: true });

  try {
    const admin = createAdminClient();
    const text = msg?.text?.trim() || "";

    if (text.startsWith("/start")) {
      const payload = text.replace(/^\/start\s*/, "").trim();

      // Login web: /start login_<token>
      if (payload.startsWith("login_")) {
        const token = payload.slice("login_".length);
        const from = msg?.from;
        if (!from?.id || !/^[a-f0-9]{32}$/.test(token)) {
          await telegramSend(chatId, "Enlace inválido. Vuelve a MeCuadra y toca Entrar otra vez.");
          return Response.json({ ok: true });
        }

        const { data: session } = await admin
          .from("telegram_auth_sessions")
          .select("token, status, created_at")
          .eq("token", token)
          .maybeSingle();

        const fresh =
          session && Date.now() - new Date(session.created_at as string).getTime() < 15 * 60 * 1000;

        if (!fresh || session.status === "consumed") {
          await telegramSend(
            chatId,
            "Ese enlace caducó. Vuelve a MeCuadra → Entrar y abre Telegram de nuevo.",
          );
          return Response.json({ ok: true });
        }

        await admin
          .from("telegram_auth_sessions")
          .update({
            status: "confirmed",
            telegram_id: from.id,
            first_name: from.first_name ?? null,
            last_name: from.last_name ?? null,
            username: from.username ?? null,
            photo_url: null,
          })
          .eq("token", token)
          .neq("status", "consumed");

        const resume = `${siteOrigin()}/login?resume=${token}`;
        await telegramSend(
          chatId,
          "✓ Acceso a MeCuadra confirmado.\n\nEres tú quien abrió el login desde mecuadra.vercel.app. Vuelve a la web o toca el botón — no compartas este chat con nadie.",
          {
            reply_markup: {
              inline_keyboard: [[{ text: "Volver a MeCuadra", url: resume }]],
            },
          },
        );
        return Response.json({ ok: true });
      }

      // Flujo legado: vincular Cubacel a una cuenta ya logueada
      if (payload) {
        const { data: link } = await admin
          .from("telegram_links")
          .select("token, user_id, created_at")
          .eq("token", payload)
          .maybeSingle();
        const fresh =
          link && Date.now() - new Date(link.created_at as string).getTime() < 20 * 60 * 1000;
        if (!fresh) {
          await telegramSend(chatId, "Ese enlace caducó. Vuelve a MeCuadra y pide uno nuevo.");
          return Response.json({ ok: true });
        }
        await admin.from("telegram_links").update({ chat_id: chatId }).eq("token", payload);
        await telegramSend(
          chatId,
          "Toca el botón para compartir el celular Cubacel con el que te registraste en Telegram. Es gratis: no hay SMS.",
          { reply_markup: shareContactKeyboard() },
        );
        return Response.json({ ok: true });
      }

      const bot = telegramBotUsername();
      await telegramSend(
        chatId,
        `Hola. Para entrar a MeCuadra abre https://mecuadra.vercel.app/login y toca Continuar con Telegram${bot ? ` (o @${bot})` : ""}.`,
      );
      return Response.json({ ok: true });
    }

    const contact = msg?.contact;
    if (contact?.phone_number) {
      if (contact.user_id && msg.from?.id && contact.user_id !== msg.from.id) {
        await telegramSend(chatId, "Comparte tu propio celular, no el de otra persona.");
        return Response.json({ ok: true });
      }
      const e164 = normalizeCubanPhone(contact.phone_number);
      if (!isCubanMobile(e164)) {
        await telegramSend(chatId, "Hace falta un celular cubano (+53 y 8 dígitos).");
        return Response.json({ ok: true });
      }

      const { data: link } = await admin
        .from("telegram_links")
        .select("token, user_id, created_at")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const fresh =
        link && Date.now() - new Date(link.created_at as string).getTime() < 20 * 60 * 1000;
      if (!fresh || !link) {
        await telegramSend(
          chatId,
          "No encuentro una sesión abierta. Vuelve a MeCuadra y toca Verificar con Telegram.",
        );
        return Response.json({ ok: true });
      }

      const { error } = await admin
        .from("profiles")
        .update({ phone: e164, phone_verified: true })
        .eq("id", link.user_id);
      if (error) {
        const dup = error.code === "23505";
        await telegramSend(
          chatId,
          dup ? "Ese celular ya está en otra cuenta de MeCuadra." : "No se pudo guardar el número.",
        );
        return Response.json({ ok: true });
      }
      await admin.from("telegram_links").delete().eq("user_id", link.user_id);
      await telegramSend(
        chatId,
        "Listo. Vuelve a MeCuadra: tu Cubacel ya está verificado. Gratis, sin SMS.",
      );
    }
  } catch {
    if (chatId) {
      try {
        await telegramSend(chatId, "Hubo un fallo técnico. Inténtalo de nuevo en un minuto.");
      } catch {
        /* ignore */
      }
    }
  }

  return Response.json({ ok: true });
}
