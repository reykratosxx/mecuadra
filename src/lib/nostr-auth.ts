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
  if (originTag && origin && !originTag.startsWith(origin) && originTag !== origin) {
    return "Origin mismatch.";
  }
  return null;
}

export async function establishNostrSession(pubkeyHex: string, silentPayment?: string) {
  const admin = createAdminClient();
  const email = nostrAuthEmail(pubkeyHex);
  const npub = npubEncode(pubkeyHex);
  const username = `npub${pubkeyHex.slice(0, 10)}`.toLowerCase();
  const name = `${npub.slice(0, 12)}…${npub.slice(-4)}`;

  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("npub", npub)
    .maybeSingle();

  if (!existing) {
    const { data: byEmail } = await admin.auth.admin.listUsers();
    const found = byEmail.users.find((u) => u.email === email);
    if (!found) {
      await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          npub,
          pubkey: pubkeyHex,
          full_name: name,
          name,
          user_name: username,
        },
      });
    }
  }

  const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (linkErr || !link.properties?.hashed_token || !link.user?.id) {
    return { error: linkErr?.message || "Could not open session.", status: 500 as const };
  }

  const userId = link.user.id;
  const patch: Record<string, unknown> = {
    npub,
    pubkey_hex: pubkeyHex,
    verified: true,
  };
  if (silentPayment) patch.silent_payment_code = silentPayment;

  await admin.from("profiles").update(patch).eq("id", userId);

  const { data: profile } = await admin.from("profiles").select("id").eq("id", userId).maybeSingle();
  if (!profile) {
    await admin.from("profiles").insert({
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
  }

  const supabase = await createClient();
  const { error: sessionErr } = await supabase.auth.verifyOtp({
    type: "email",
    token_hash: link.properties.hashed_token,
  });

  if (sessionErr) {
    return { error: sessionErr.message, status: 500 as const };
  }

  return { ok: true as const, userId, npub };
}
