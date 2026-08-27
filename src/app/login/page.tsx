"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { TelegramLoginButton } from "@/components/TelegramLoginButton";
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

type BotPhase = "idle" | "waiting" | "finishing" | "error";

function AuthCard() {
  const router = useRouter();
  const params = useSearchParams();
  const { currentUser, refresh } = useStore();
  const next = params.get("next");
  const resume = params.get("resume");
  const safeNext = next && next.startsWith("/") ? next : "/explorar";
  const errParam = params.get("error");
  const [error, setError] = useState(errParam ? decodeURIComponent(errParam) : "");
  const [busyWidget, setBusyWidget] = useState(false);
  const [botPhase, setBotPhase] = useState<BotPhase>("idle");
  const [showAlt, setShowAlt] = useState(false);
  const [deepLink, setDeepLink] = useState("");
  const pollRef = useRef<number | null>(null);

  const finishWithToken = useCallback(
    async (token: string) => {
      setBotPhase("finishing");
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
          setBotPhase("error");
          return;
        }
        await refresh();
        router.replace(safeNext);
      } catch {
        setError("Falló la conexión. Inténtalo de nuevo.");
        setBotPhase("error");
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
            const json = (await res.json()) as { status?: string };
            if (json.status === "confirmed") {
              stopPoll();
              await finishWithToken(token);
            } else if (json.status === "expired") {
              stopPoll();
              setError("El enlace caducó. Empieza de nuevo con el acceso alternativo.");
              setBotPhase("error");
            }
          } catch {
            /* siguiente tick */
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
    setShowAlt(true);
    void finishWithToken(resume);
  }, [resume, finishWithToken]);

  useEffect(() => () => stopPoll(), [stopPoll]);

  const onWidgetAuth = useCallback(
    async (user: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
      auth_date: number;
      hash: string;
    }) => {
      setBusyWidget(true);
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
          setBusyWidget(false);
          setShowAlt(true);
          return;
        }
        await refresh();
        router.replace(safeNext);
      } catch {
        setError("Falló la conexión. Inténtalo de nuevo.");
        setBusyWidget(false);
        setShowAlt(true);
      }
    },
    [refresh, router, safeNext],
  );

  async function startBotLogin() {
    setError("");
    setBotPhase("waiting");
    setShowAlt(true);
    try {
      const res = await fetch("/api/auth/telegram/session", { method: "POST" });
      const json = (await res.json()) as { token?: string; url?: string; error?: string };
      if (!res.ok || !json.token || !json.url) {
        setError(json.error || "No se pudo iniciar el acceso alternativo.");
        setBotPhase("error");
        return;
      }
      setDeepLink(json.url);
      window.open(json.url, "_blank", "noopener,noreferrer");
      startPoll(json.token);
    } catch {
      setError("Falló la conexión. Inténtalo de nuevo.");
      setBotPhase("error");
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

  const hideWidget = busyWidget || botPhase === "waiting" || botPhase === "finishing";

  return (
    <div className="card overflow-hidden p-0">
      <div className="bg-[linear-gradient(135deg,#229ED9_0%,#7c3aed_100%)] px-6 py-8 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">MeCuadra</p>
        <h1 className="mt-2 font-display text-3xl leading-tight">Entra con Telegram</h1>
        <p className="mt-2 text-sm text-white/90">
          Usamos el login oficial de Telegram. Confirma en la app — no es SMS ni un enlace raro.
        </p>
      </div>

      <div className="space-y-5 p-6">
        {busyWidget || botPhase === "finishing" ? (
          <div className="flex flex-col items-center gap-3 py-6" role="status">
            <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand/25 border-t-brand" />
            <p className="text-center text-sm font-medium text-ink">Abriendo tu sesión…</p>
          </div>
        ) : botPhase === "waiting" ? (
          <div className="flex flex-col items-center gap-3 py-2" role="status">
            <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand/25 border-t-brand" />
            <p className="text-center text-sm font-medium text-ink">
              Esperando al bot oficial @{botUsername}…
            </p>
            <p className="max-w-sm text-center text-xs text-mute">
              En Telegram toca <strong className="text-ink">Iniciar</strong>. Es el bot de MeCuadra,
              el mismo que ves en esta página.
            </p>
            {deepLink ? (
              <a href={deepLink} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
                Abrir @{botUsername} otra vez
              </a>
            ) : null}
            <button
              type="button"
              className="text-xs text-mute underline"
              onClick={() => {
                stopPoll();
                setBotPhase("idle");
              }}
            >
              Volver al login oficial
            </button>
          </div>
        ) : (
          <>
            <div>
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-mute">
                Recomendado · login oficial
              </p>
              {!hideWidget ? (
                <TelegramLoginButton
                  botUsername={botUsername}
                  onAuth={(u) => void onWidgetAuth(u)}
                  onError={(msg) => {
                    setError(msg);
                    setShowAlt(true);
                  }}
                />
              ) : null}
            </div>

            <div className="rounded-2xl border border-line bg-surface-2 px-4 py-3 text-xs leading-5 text-mute">
              <p className="font-semibold text-ink">Así se ve el login oficial</p>
              <ol className="mt-1.5 list-decimal space-y-1 pl-4">
                <li>Toca el botón azul de Telegram.</li>
                <li>
                  En la app confirma <span className="font-medium text-ink">Aceptar</span> (aviso
                  oficial de Telegram, no un SMS).
                </li>
                <li>Vuelves a MeCuadra con la sesión abierta.</li>
              </ol>
              <p className="mt-2 text-[11px]">
                Si te pide el número y se queda colgado, no esperes SMS: usa la alternativa de abajo.
              </p>
            </div>
          </>
        )}

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        {!hideWidget ? (
          <div className="border-t border-line pt-4">
            {!showAlt ? (
              <button
                type="button"
                className="w-full text-center text-sm font-medium text-brand"
                onClick={() => setShowAlt(true)}
              >
                ¿No llega la confirmación? Ver alternativa
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-ink">Acceso por el bot oficial</p>
                <p className="text-xs leading-5 text-mute">
                  Solo si el login oficial pide teléfono y no termina. Abre{" "}
                  <span className="font-medium text-ink">@{botUsername}</span> (bot de MeCuadra, no
                  un chat desconocido), pulsa Iniciar y vuelves aquí.
                </p>
                <button
                  type="button"
                  className="btn-ghost w-full"
                  onClick={() => void startBotLogin()}
                >
                  Abrir @{botUsername}
                </button>
              </div>
            )}
          </div>
        ) : null}

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
