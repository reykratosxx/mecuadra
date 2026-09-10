import { createHmac } from "crypto";
import { verifyEvent, type Event } from "nostr-tools/pure";
import { npubEncode } from "nostr-tools/nip19";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { nostrAuthEmail } from "@/lib/nostr/keys";

const MAX_AGE_SEC = 10 * 60;

export function assertLoginEvent(event: Event, origin: string) {
  if (!verifyEvent(event)) return "Invalid Nostr signature.";
  if (event.kind !== 22242 && event.kind !== 27235) return "Unexpected event kind.";
  const age = Math.abs(Math.floor(Date.now() / 1000) - event.created_at);
  if (age > MAX_AGE_SEC) return "Login event expired. Sign again.";
  const challenge = event.tags.find((t) => t[0] === "challenge")?.[1];
  if (!challenge || challenge.length < 16) return "Missing challenge tag.";
  const originTag = event.tags.find((t) => t[0] === "origin")?.[1];
  if (originTag && origin && originTag !== origin && !origin.startsWith(originTag) && !originTag.startsWith(origin)) {
    return "Origin mismatch.";
  }
  return null;
}

function nostrPassword(pubkeyHex: string) {
  const secret =
    process.env.CASHU_DEMO_SECRET ||
    process.env.MESSAGE_ENCRYPTION_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "mecuadra-nostr";
  return createHmac("sha256", secret).update(`nostr:${pubkeyHex.toLowerCase()}`).digest("hex");
}

export async function establishNostrSession(pubkeyHex: string, silentPayment?: string) {
  const admin = createAdminClient();
  const email = nostrAuthEmail(pubkeyHex);
  const npub = npubEncode(pubkeyHex);
  const username = `npub${pubkeyHex.slice(0, 10)}`.toLowerCase();
  const name = `${npub.slice(0, 12)}…${npub.slice(-4)}`;
  const password = nostrPassword(pubkeyHex);

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      npub,
      pubkey: pubkeyHex,
      full_name: name,
      name,
      user_name: username,
    },
  });

  let userId = created?.user?.id;
  if (createErr || !userId) {
    const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    userId = link.user?.id;
    if (!userId) {
      return { error: createErr?.message || linkErr?.message || "Could not open session.", status: 500 as const };
    }
    const { error: updErr } = await admin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    });
    if (updErr) {
      return { error: updErr.message, status: 500 as const };
    }
  }

  const patch: Record<string, unknown> = {
    npub,
    pubkey_hex: pubkeyHex,
    verified: true,
  };
  if (silentPayment) patch.silent_payment_code = silentPayment;

  const { error: updateErr } = await admin.from("profiles").update(patch).eq("id", userId);
  if (updateErr) {
    return { error: updateErr.message, status: 500 as const };
  }

  const { data: profile } = await admin.from("profiles").select("id").eq("id", userId).maybeSingle();
  if (!profile) {
    const { error: insertErr } = await admin.from("profiles").insert({
      id: userId,
      username: username.slice(0, 24),
      name,
      npub,
      pubkey_hex: pubkeyHex,
      silent_payment_code: silentPayment ?? null,
      province: "",
      municipality: "",
      verified: true,
    });
    if (insertErr) {
      return { error: insertErr.message, status: 500 as const };
    }
  }

  const supabase = await createClient();
  const { error: sessionErr } = await supabase.auth.signInWithPassword({ email, password });
  if (sessionErr) {
    return { error: sessionErr.message, status: 500 as const };
  }

  return { ok: true as const, userId, npub };
}
