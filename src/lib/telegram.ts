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

/** Verifica el payload del Login Widget (HMAC-SHA256 del bot token). */
export function verifyTelegramLogin(data: TelegramLoginPayload, maxAgeSec = 86400) {
  const { hash, ...rest } = data;
  if (!hash || !data.id || !data.auth_date) return false;
  if (Math.floor(Date.now() / 1000) - Number(data.auth_date) > maxAgeSec) return false;

  const checkString = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${String((rest as Record<string, unknown>)[key] ?? "")}`)
    .join("\n");

  const secret = createHash("sha256").update(botToken()).digest();
  const hmac = createHmac("sha256", secret).update(checkString).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(hmac, "hex"), Buffer.from(hash, "hex"));
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
