import { telegramBotUsername } from "@/lib/telegram";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return Response.json({ ok: false, error: "Falta TELEGRAM_BOT_TOKEN en Vercel." }, { status: 500 });
  }
  const origin = new URL(request.url).origin;
  const hook = `${origin}/api/auth/telegram`;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const body: Record<string, unknown> = { url: hook, drop_pending_updates: true };
  if (secret) body.secret_token = secret;

  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { ok?: boolean; description?: string };
  return Response.json({
    ok: Boolean(json.ok),
    webhook: hook,
    bot: telegramBotUsername() || null,
    description: json.description ?? null,
  });
}
