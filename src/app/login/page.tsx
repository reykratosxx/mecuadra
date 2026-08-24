"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { TelegramLoginButton } from "@/components/TelegramLoginButton";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";

const botUsername = (
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || ""
).replace(/^@/, "");

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md py-10">
      <div className="mb-6 flex justify-center">
        <Logo withWord size={48} />
      </div>
      <Suspense fallback={<div className="card p-6 text-sm text-mute">Cargando…</div>}>
        <AuthCard />
      </Suspense>
    </div>
  );
}

function AuthCard() {
  const router = useRouter();
  const params = useSearchParams();
  const { currentUser, refresh } = useStore();
  const next = params.get("next");
  const safeNext = next && next.startsWith("/") ? next : "/explorar";
  const errParam = params.get("error");
  const [error, setError] = useState(
    errParam ? decodeURIComponent(errParam) : "",
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (currentUser) router.replace(safeNext);
  }, [currentUser, router, safeNext]);

  const onAuth = useCallback(
    async (user: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
      auth_date: number;
      hash: string;
    }) => {
      setBusy(true);
      setError("");
      try {
        const res = await fetch("/api/auth/telegram/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        const json = (await res.json()) as { error?: string };
        if (!res.ok) {
          setError(json.error || "No se pudo iniciar sesión con Telegram.");
          setBusy(false);
          return;
        }
        await refresh();
        router.replace(safeNext);
      } catch {
        setError("Falló la conexión. Inténtalo de nuevo.");
        setBusy(false);
      }
    },
    [refresh, router, safeNext],
  );

  if (!isSupabaseConfigured()) {
    return (
      <div className="card p-6">
        <h1 className="font-display text-2xl">Falta configurar Supabase</h1>
        <p className="mt-2 text-sm text-mute">
          Añade las claves en Vercel y en <code>.env.local</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="bg-[linear-gradient(135deg,#229ED9_0%,#7c3aed_100%)] px-6 py-8 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">MeCuadra</p>
        <h1 className="mt-2 font-display text-3xl leading-tight">Entra con Telegram</h1>
        <p className="mt-2 text-sm text-white/90">
          Un toque en Telegram para confirmar que eres tú. Sin SMS y sin escribir el número.
        </p>
      </div>

      <div className="space-y-5 p-6">
        {busy ? (
          <div className="flex flex-col items-center gap-3 py-6" role="status">
            <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand/25 border-t-brand" />
            <p className="text-center text-sm font-medium text-ink">Abriendo tu sesión…</p>
            <p className="text-center text-xs text-mute">Ya confirmaste en Telegram. Un momento.</p>
          </div>
        ) : (
          <TelegramLoginButton
            botUsername={botUsername}
            onAuth={(u) => void onAuth(u)}
            onError={setError}
          />
        )}

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <ul className="space-y-2 text-sm text-mute">
          <li>· Explorar ofertas: libre, sin registro.</li>
          <li>· Publicar y aplicar: con Telegram.</li>
          <li>· Sin Google, sin correo y <strong className="font-semibold text-ink">sin SMS</strong>.</li>
        </ul>

        <p className="text-center text-sm">
          <Link href="/explorar" className="font-semibold text-brand">
            Ver el mercado sin entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
