import { createAdminClient } from "@/lib/supabase/admin";
import { isCubanMobile, normalizeCubanPhone } from "@/lib/phone";
import {
  shareContactKeyboard,
  telegramAnswerCallback,
  telegramEditMessage,
  telegramSend,
} from "@/lib/telegram";

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
  message_id?: number;
};
type TgCallbackQuery = {
  id: string;
  from?: TgFrom;
  message?: TgMessage;
  data?: string;
};
type TgUpdate = { message?: TgMessage; callback_query?: TgCallbackQuery };

const TOKEN_RE = /^[a-f0-9]{32}$/;
const SESSION_TTL_MS = 15 * 60 * 1000;

function isFresh(createdAt: unknown) {
  return Date.now() - new Date(String(createdAt)).getTime() < SESSION_TTL_MS;
}

function authorized(request: Request) {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected) return true;
  return request.headers.get("x-telegram-bot-api-secret-token") === expected;
}

function siteOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://mecuadra.vercel.app").replace(/\/$/, "");
}

async function handleCallback(query: TgCallbackQuery) {
  const chatId = query.message?.chat?.id;
  const messageId = query.message?.message_id;
  const from = query.from;
  const parts = (query.data || "").split(":");

  if (parts[0] !== "tglogin" || !from?.id || !TOKEN_RE.test(parts[2] ?? "")) {
    await telegramAnswerCallback(query.id, "Acción no válida.");
    return;
  }

  const [, action, token] = parts;
  const admin = createAdminClient();

  const { data: session } = await admin
    .from("telegram_auth_sessions")
    .select("token, status, telegram_id, created_at")
    .eq("token", token)
    .maybeSingle();

  if (!session || !isFresh(session.created_at)) {
    await telegramAnswerCallback(query.id, "El enlace caducó. Vuelve a MeCuadra y entra otra vez.", true);
    return;
  }

  if (session.telegram_id && Number(session.telegram_id) !== from.id) {
    await telegramAnswerCallback(query.id, "Este acceso pertenece a otra cuenta.", true);
    return;
  }

  if (action === "no") {
    await admin.from("telegram_auth_sessions").delete().eq("token", token);
    await telegramAnswerCallback(query.id, "Acceso cancelado.");
    if (chatId && messageId) {
      await telegramEditMessage(
        chatId,
        messageId,
        "✋ Acceso cancelado. No se abrió ninguna sesión.\n\nSi no fuiste tú quien abrió el login, ignora este chat.",
      );
    }
    return;
  }

  if (session.status === "consumed") {
    await telegramAnswerCallback(query.id, "Esa sesión ya se usó.");
    return;
  }

  await admin
    .from("telegram_auth_sessions")
    .update({
      status: "confirmed",
      telegram_id: from.id,
      first_name: from.first_name ?? null,
      last_name: from.last_name ?? null,
      username: from.username ?? null,
    })
    .eq("token", token)
    .neq("status", "consumed");

  await telegramAnswerCallback(query.id, "Listo, vuelve a MeCuadra.");

  if (chatId && messageId) {
    await telegramEditMessage(
      chatId,
      messageId,
      "✓ Acceso confirmado.\n\nVuelve a MeCuadra: la sesión se abre sola. Si cerraste la pestaña, toca el botón.",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Volver a MeCuadra", url: `${siteOrigin()}/login?resume=${token}` }],
          ],
        },
      },
    );
  }
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return new Response("unauthorized", { status: 401 });
  }

  const update = (await request.json()) as TgUpdate;

  if (update.callback_query) {
    await handleCallback(update.callback_query);
    return Response.json({ ok: true });
  }

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
        if (!from?.id || !TOKEN_RE.test(token)) {
          await telegramSend(chatId, "Enlace inválido. Vuelve a MeCuadra y toca Entrar otra vez.");
          return Response.json({ ok: true });
        }

        const { data: session } = await admin
          .from("telegram_auth_sessions")
          .select("token, status, created_at")
          .eq("token", token)
          .maybeSingle();

        if (!session || !isFresh(session.created_at) || session.status === "consumed") {
          await telegramSend(
            chatId,
            "Ese enlace caducó. Vuelve a MeCuadra → Entrar y abre Telegram de nuevo.",
          );
          return Response.json({ ok: true });
        }

        await admin
          .from("telegram_auth_sessions")
          .update({
            telegram_id: from.id,
            first_name: from.first_name ?? null,
            last_name: from.last_name ?? null,
            username: from.username ?? null,
          })
          .eq("token", token)
          .eq("status", "pending");

        const who = [from.first_name, from.last_name].filter(Boolean).join(" ") || "tu cuenta";
        await telegramSend(
          chatId,
          `¿Quieres iniciar sesión en MeCuadra como ${who}?\n\nAlguien abrió el login en mecuadra.vercel.app hace un momento. Si no fuiste tú, toca "No fui yo".`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: "✅ Sí, iniciar sesión", callback_data: `tglogin:yes:${token}` }],
                [{ text: "✋ No fui yo", callback_data: `tglogin:no:${token}` }],
              ],
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

      await telegramSend(
        chatId,
        "Bienvenido a MeCuadra — trueque entre personas en Cuba.\n\nToca el botón para abrir el mercado aquí mismo, dentro de Telegram. Tu sesión se abre sola: sin SMS y sin poner tu número.",
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "🤝 Abrir MeCuadra", web_app: { url: `${siteOrigin()}/login` } }],
            ],
          },
        },
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
