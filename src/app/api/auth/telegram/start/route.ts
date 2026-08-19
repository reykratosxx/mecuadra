import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { telegramBotUsername } from "@/lib/telegram";

export async function POST() {
  const username = telegramBotUsername();
  if (!username) {
    return Response.json({ error: "Falta TELEGRAM_BOT_USERNAME." }, { status: 500 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Inicia sesión primero." }, { status: 401 });
  }

  const token = randomBytes(16).toString("hex");
  const { error } = await supabase.from("telegram_links").insert({ token, user_id: user.id });
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    url: `https://t.me/${username}?start=${token}`,
  });
}
