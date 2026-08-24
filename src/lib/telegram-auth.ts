import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { telegramAuthEmail } from "@/lib/telegram";

export type TelegramIdentity = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

function displayName(data: TelegramIdentity) {
  return (
    [data.first_name, data.last_name].filter(Boolean).join(" ").trim() ||
    data.username ||
    `tg${data.id}`
  );
}

function usernameFromTg(data: TelegramIdentity) {
  const raw = (data.username || `tg${data.id}`).toLowerCase().replace(/[^a-z0-9_]/g, "");
  return raw.slice(0, 24) || `tg${data.id}`;
}

/** Crea/actualiza el usuario Supabase y deja la cookie de sesión. */
export async function establishTelegramSession(identity: TelegramIdentity) {
  const admin = createAdminClient();
  const email = telegramAuthEmail(identity.id);
  const name = displayName(identity);
  const username = usernameFromTg(identity);
  const avatar = identity.photo_url || null;

  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("telegram_id", identity.id)
    .maybeSingle();

  if (!existing) {
    await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        telegram_id: identity.id,
        full_name: name,
        name,
        user_name: username,
        avatar_url: avatar,
        telegram_username: identity.username ?? null,
      },
    });
  }

  const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (linkErr || !link.properties?.hashed_token || !link.user?.id) {
    return { error: linkErr?.message || "No se pudo abrir la sesión.", status: 500 as const };
  }

  const userId = link.user.id;

  await admin
    .from("profiles")
    .update({
      telegram_id: identity.id,
      name,
      avatar_url: avatar,
      phone_verified: true,
      verified: true,
    })
    .eq("id", userId);

  const { data: profile } = await admin.from("profiles").select("id").eq("id", userId).maybeSingle();
  if (!profile) {
    const uniq = `${username}_${String(identity.id).slice(-4)}`;
    await admin.from("profiles").insert({
      id: userId,
      username: uniq.slice(0, 24),
      name,
      avatar_url: avatar,
      telegram_id: identity.id,
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
    return { error: sessionErr.message, status: 500 as const };
  }

  return { ok: true as const, userId };
}
