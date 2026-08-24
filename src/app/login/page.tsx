"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";

const botUsername = (
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "mecuadrabot"
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

type Phase = "idle" | "waiting" | "finishing" | "error";

function AuthCard() {
  const router = useRouter();
  const params = useSearchParams();
  const { currentUser, refresh } = useStore();
  const next = params.get("next");
  const resume = params.get("resume");
  const safeNext = next && next.startsWith("/") ? next : "/explorar";
  const errParam = params.get("error");
  const [error, setError] = useState(
    errParam ? decodeURIComponent(errParam) : "",
  );
  const [phase, setPhase] = useState<Phase>("idle");
  const [deepLink, setDeepLink] = useState("");
  const tokenRef = useRef<string>("");
  const pollRef = useRef<number | null>(null);

  const finishWithToken = useCallback(
    async (token: string) => {
      setPhase("finishing");
      setError("");
      try {
        const res = await fetch("/api/auth/telegram/session", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const json = (await res.json()) as { error?: string };
        if (!res.ok) {
          setError(json.error || "No se pudo abrir la sesión.");
          setPhase("error");
          return;
        }
        await refresh();
        router.replace(safeNext);
      } catch {
        setError("Falló la conexión. Inténtalo de nuevo.");
        setPhase("error");
      }
    },
    [refresh, router, safeNext],
  );

  const stopPoll = useCallback(() => {
    if (pollRef.current != null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPoll = useCallback(
    (token: string) => {
      stopPoll();
      pollRef.current = window.setInterval(() => {
        void (async () => {
          try {
            const res = await fetch(`/api/auth/telegram/session?token=${token}`);
            const json = (await res.json()) as { status?: string; error?: string };
            if (json.status === "confirmed") {
              stopPoll();
              await finishWithToken(token);
            } else if (json.status === "expired") {
              stopPoll();
              setError("El enlace caducó. Vuelve a tocar Continuar con Telegram.");
              setPhase("error");
            }
          } catch {
            /* reintento en el siguiente tick */
          }
        })();
      }, 2000);
    },
    [finishWithToken, stopPoll],
  );

  useEffect(() => {
    if (currentUser) router.replace(safeNext);
  }, [currentUser, router, safeNext]);

  useEffect(() => {
    if (!resume || !/^[a-f0-9]{32}$/.test(resume)) return;
    tokenRef.current = resume;
    void finishWithToken(resume);
  }, [resume, finishWithToken]);

  useEffect(() => () => stopPoll(), [stopPoll]);

  async function startBotLogin() {
    setError("");
    setPhase("waiting");
    try {
      const res = await fetch("/api/auth/telegram/session", { method: "POST" });
      const json = (await res.json()) as { token?: string; url?: string; error?: string };
      if (!res.ok || !json.token || !json.url) {
        setError(json.error || "No se pudo iniciar el login.");
        setPhase("error");
        return;
      }
      tokenRef.current = json.token;
      setDeepLink(json.url);
      window.open(json.url, "_blank", "noopener,noreferrer");
      startPoll(json.token);
    } catch {
      setError("Falló la conexión. Inténtalo de nuevo.");
      setPhase("error");
    }
  }

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

  const waiting = phase === "waiting" || phase === "finishing";

  return (
    <div className="card overflow-hidden p-0">
      <div className="bg-[linear-gradient(135deg,#229ED9_0%,#7c3aed_100%)] px-6 py-8 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">MeCuadra</p>
        <h1 className="mt-2 font-display text-3xl leading-tight">Entra con Telegram</h1>
        <p className="mt-2 text-sm text-white/90">
          Abres el bot, confirmas que eres tú y vuelves. Sin SMS y sin escribir el número en el
          navegador.
        </p>
      </div>

      <div className="space-y-5 p-6">
        {phase === "finishing" ? (
          <div className="flex flex-col items-center gap-3 py-4" role="status">
            <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand/25 border-t-brand" />
            <p className="text-center text-sm font-medium text-ink">Abriendo tu sesión…</p>
          </div>
        ) : phase === "waiting" ? (
          <div className="flex flex-col items-center gap-3 py-2" role="status">
            <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand/25 border-t-brand" />
            <p className="text-center text-sm font-medium text-ink">Esperando confirmación en Telegram…</p>
            <p className="max-w-sm text-center text-xs text-mute">
              En la app toca <strong className="text-ink">Start</strong> / <strong className="text-ink">Iniciar</strong>.
              No pidas SMS: el bot te responde ahí mismo.
            </p>
            {deepLink ? (
              <a
                href={deepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-sm"
              >
                Abrir Telegram otra vez
              </a>
            ) : null}
            <button
              type="button"
              className="text-xs text-mute underline"
              onClick={() => {
                stopPoll();
                setPhase("idle");
              }}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn-primary w-full gap-2 py-3 text-base"
            onClick={() => void startBotLogin()}
            disabled={waiting}
          >
            Continuar con Telegram
          </button>
        )}

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <div className="rounded-2xl border border-line bg-stone-50 px-4 py-3 text-xs leading-5 text-mute">
          <p className="font-semibold text-ink">Pasos</p>
          <ol className="mt-1.5 list-decimal space-y-1 pl-4">
            <li>Toca Continuar con Telegram (se abre la app).</li>
            <li>Pulsa Iniciar / Start en @{botUsername}.</li>
            <li>Vuelve aquí — o toca “Volver a MeCuadra” en el chat del bot.</li>
          </ol>
        </div>

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
