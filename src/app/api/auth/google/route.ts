export async function POST(request: Request) {
  const body = (await request.json()) as { url?: string };
  if (!body.url) {
    return Response.json({ error: "Falta la URL de Google." }, { status: 400 });
  }
  let target: URL;
  try {
    target = new URL(body.url);
  } catch {
    return Response.json({ error: "URL inválida." }, { status: 400 });
  }
  if (!target.hostname.endsWith(".supabase.co") || !target.pathname.includes("/auth/v1/authorize")) {
    return Response.json({ error: "URL inválida." }, { status: 400 });
  }

  const res = await fetch(target, { redirect: "manual" });
  if (res.status >= 400) {
    const text = await res.text();
    let msg = text;
    try {
      const parsed = JSON.parse(text) as { msg?: string };
      if (parsed.msg) msg = parsed.msg;
    } catch {
      /* keep text */
    }
    return Response.json({ error: msg }, { status: 400 });
  }
  return Response.json({ ok: true });
}
