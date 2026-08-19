const API = "https://api.telegram.org";

function botToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("Falta TELEGRAM_BOT_TOKEN");
  return token;
}

export function telegramBotUsername() {
  return (process.env.TELEGRAM_BOT_USERNAME ?? "").replace(/^@/, "");
}

export function telegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_USERNAME);
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
