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

export function telegramAuthEmail(telegramId: number) {
  return `tg_${telegramId}@telegram.mecuadra.app`;
}

export async function telegramSend(
  chatId: number,
  text: string,
  extra?: Record<string, unknown>,
) {
  const res = await fetch(`${API}/bot${botToken()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, ...extra }),
  });
  if (!res.ok) {
    throw new Error(`Telegram ${res.status}`);
  }
}

export function shareContactKeyboard() {
  return {
    keyboard: [[{ text: "Compartir mi celular Cubacel", request_contact: true }]],
    one_time_keyboard: true,
    resize_keyboard: true,
  };
}
