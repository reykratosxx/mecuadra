import { createHash, createHmac, timingSafeEqual } from "crypto";

const API = "https://api.telegram.org";

export type TelegramLoginPayload = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

function botToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("Falta TELEGRAM_BOT_TOKEN");
  return token;
}

export function telegramBotUsername() {
  return (
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ||
    process.env.TELEGRAM_BOT_USERNAME ||
    ""
  ).replace(/^@/, "");
}

export function telegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && telegramBotUsername());
}

/** Normaliza el payload del widget (números pueden llegar como string). */
export function coerceTelegramLogin(raw: Record<string, unknown>): TelegramLoginPayload | null {
  const id = Number(raw.id);
  const auth_date = Number(raw.auth_date);
  const hash = typeof raw.hash === "string" ? raw.hash : "";
  if (!Number.isFinite(id) || !Number.isFinite(auth_date) || !hash) return null;

  const out: TelegramLoginPayload = {
    id,
    first_name: String(raw.first_name ?? ""),
    auth_date,
    hash,
  };
  if (raw.last_name != null && String(raw.last_name)) out.last_name = String(raw.last_name);
  if (raw.username != null && String(raw.username)) out.username = String(raw.username);
  if (raw.photo_url != null && String(raw.photo_url)) out.photo_url = String(raw.photo_url);
  return out;
}

/**
 * Verifica el payload del Login Widget (HMAC-SHA256 del bot token).
 * Solo incluye campos presentes — campos vacíos rompen el hash.
 */
export function verifyTelegramLogin(data: TelegramLoginPayload, maxAgeSec = 86400) {
  const { hash, ...rest } = data;
  if (!hash || !data.id || !data.auth_date) return false;
  if (Math.floor(Date.now() / 1000) - Number(data.auth_date) > maxAgeSec) return false;

  const checkString = Object.keys(rest)
    .filter((key) => {
      const v = (rest as Record<string, unknown>)[key];
      return v !== undefined && v !== null && v !== "";
    })
    .sort()
    .map((key) => `${key}=${String((rest as Record<string, unknown>)[key])}`)
    .join("\n");

  const secret = createHash("sha256").update(botToken()).digest();
  const hmac = createHmac("sha256", secret).update(checkString).digest("hex");

  try {
    const a = Buffer.from(hmac, "hex");
    const b = Buffer.from(String(hash), "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export type TelegramInitDataUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

/**
 * Verifica el `initData` de una Mini App de Telegram.
 * Clave secreta = HMAC-SHA256(bot_token) con la constante "WebAppData".
 */
export function verifyTelegramInitData(
  initData: string,
  maxAgeSec = 24 * 60 * 60,
): TelegramInitDataUser | null {
  if (!initData) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const authDate = Number(params.get("auth_date"));
  if (!Number.isFinite(authDate)) return null;
  if (Math.floor(Date.now() / 1000) - authDate > maxAgeSec) return null;

  const checkString = [...params.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secret = createHmac("sha256", "WebAppData").update(botToken()).digest();
  const expected = createHmac("sha256", secret).update(checkString).digest("hex");

  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(hash, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  try {
    const user = JSON.parse(params.get("user") || "null") as TelegramInitDataUser | null;
    if (!user?.id) return null;
    return user;
  } catch {
    return null;
  }
}

export function telegramAuthEmail(telegramId: number) {
  return `tg_${telegramId}@telegram.mecuadra.app`;
}

async function telegramCall(method: string, body: Record<string, unknown>) {
  const res = await fetch(`${API}/bot${botToken()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Telegram ${method} ${res.status}`);
  }
  return res.json() as Promise<{ ok: boolean; result?: unknown }>;
}

/** Foto de perfil del usuario que ya abrió el bot (no viene en /start). */
export async function telegramUserPhotoFile(userId: number): Promise<{
  bytes: Uint8Array;
  contentType: string;
  ext: string;
} | null> {
  try {
    const listed = await telegramCall("getUserProfilePhotos", { user_id: userId, limit: 1 });
    const photos = (listed.result as { photos?: { file_id: string }[][] } | undefined)?.photos;
    const sizes = photos?.[0];
    const fileId = sizes?.[sizes.length - 1]?.file_id;
    if (!fileId) return null;

    const file = await telegramCall("getFile", { file_id: fileId });
    const filePath = (file.result as { file_path?: string } | undefined)?.file_path;
    if (!filePath) return null;

    const res = await fetch(`${API}/file/bot${botToken()}/${filePath}`);
    if (!res.ok) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const rawExt = filePath.split(".").pop() || "jpg";
    const ext = /^[a-z0-9]+$/i.test(rawExt) ? rawExt.toLowerCase() : "jpg";
    return { bytes, contentType, ext };
  } catch {
    return null;
  }
}

export async function telegramSend(
  chatId: number,
  text: string,
  extra?: Record<string, unknown>,
) {
  await telegramCall("sendMessage", { chat_id: chatId, text, ...extra });
}

export async function telegramAnswerCallback(
  callbackQueryId: string,
  text?: string,
  showAlert = false,
) {
  await telegramCall("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    ...(text ? { text, show_alert: showAlert } : {}),
  });
}

export async function telegramEditMessage(
  chatId: number,
  messageId: number,
  text: string,
  extra?: Record<string, unknown>,
) {
  await telegramCall("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    ...extra,
  });
}

export function shareContactKeyboard() {
  return {
    keyboard: [[{ text: "Compartir mi celular Cubacel", request_contact: true }]],
    one_time_keyboard: true,
    resize_keyboard: true,
  };
}
