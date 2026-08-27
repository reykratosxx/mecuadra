"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Logo } from "@/components/Logo";
import { TelegramLoginButton } from "@/components/TelegramLoginButton";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";

type TelegramWebApp = {
  initData?: string;
  ready?: () => void;
  expand?: () => void;
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

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
type BotSession = { token: string; url: string };

const TOKEN_RE = /^[a-f0-9]{32}$/;

async function requestBotSession(): Promise<BotSession | { error: string }> {
  try {
    const res = await fetch("/api/auth/telegram/session", { method: "POST" });
    const json = (await res.json()) as { token?: string; url?: string; error?: string };
    if (!res.ok || !json.token || !json.url) {
      return { error: json.error || "No se pudo preparar el acceso con Telegram." };
    }
    return { token: json.token, url: json.url };
  } catch {
    return { error: "Falló la conexión con el servidor." };
  }
}

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
  const [showWidget, setShowWidget] = useState(false);
  const [session, setSession] = useState<BotSession | null>(null);
  const [miniApp, setMiniApp] = useState(false);
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

  /** Sesión instantánea cuando MeCuadra se abre dentro de Telegram (Mini App). */
  const loginWithInitData = useCallback(
    async (initData: string) => {
      setMiniApp(true);
      setError("");
      try {
        const res = await fetch("/api/auth/telegram/webapp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData }),
        });
        const json = (await res.json()) as { error?: string };
        if (!res.ok) {
          setMiniApp(false);
          setError(json.error || "Telegram no validó la sesión.");
          return;
        }
        await refresh();
        router.replace(safeNext);
      } catch {
        setMiniApp(false);
        setError("Falló la conexión. Inténtalo de nuevo.");
      }
    },
    [refresh, router, safeNext],
  );

  const onTelegramSdkReady = useCallback(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;
    webApp.ready?.();
    webApp.expand?.();
    if (webApp.initData) void loginWithInitData(webApp.initData);
  }, [loginWithInitData]);

  const stopPoll = useCallback(() => {
    if (pollRef.current != null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  /** Pide un token nuevo para que el enlace del bot esté listo antes del toque. */
  const createSession = useCallback(async () => {
    const created = await requestBotSession();
    if ("error" in created) {
      setError(created.error);
      return null;
    }
    setSession(created);
    return created;
  }, []);

  const checkOnce = useCallback(
    async (token: string) => {
      const res = await fetch(`/api/auth/telegram/session?token=${token}`);
      const json = (await res.json()) as { status?: string };
      if (json.status === "confirmed") {
        stopPoll();
        await finishWithToken(token);
        return;
      }
      if (json.status === "cancelled") {
        stopPoll();
        setSession(null);
        setBotPhase("error");
        setError("Cancelaste el acceso en Telegram. Puedes intentarlo de nuevo.");
        void createSession();
        return;
      }
      if (json.status === "expired") {
        stopPoll();
        setSession(null);
        setBotPhase("error");
        setError("El enlace caducó. Toca Continuar con Telegram otra vez.");
        void createSession();
      }
    },
    [createSession, finishWithToken, stopPoll],
  );

  const startPoll = useCallback(
    (token: string) => {
      stopPoll();
      pollRef.current = window.setInterval(() => {
        void checkOnce(token).catch(() => {
          /* siguiente tick */
        });
      }, 2000);
    },
    [checkOnce, stopPoll],
  );

  useEffect(() => {
    if (currentUser) router.replace(safeNext);
  }, [currentUser, router, safeNext]);

  useEffect(() => {
    if (resume && TOKEN_RE.test(resume)) return;
    let alive = true;
    void (async () => {
      const created = await requestBotSession();
      if (!alive) return;
      if ("error" in created) setError(created.error);
      else setSession(created);
    })();
    return () => {
      alive = false;
    };
  }, [resume]);

  useEffect(() => {
    if (!resume || !TOKEN_RE.test(resume)) return;
    void (async () => {
      await finishWithToken(resume);
    })();
  }, [resume, finishWithToken]);

  useEffect(() => () => stopPoll(), [stopPoll]);

  // Al volver del app switcher (Telegram → navegador) comprobamos de inmediato.
  useEffect(() => {
    if (botPhase !== "waiting" || !session) return;
    function onVisible() {
      if (document.visibilityState === "visible" && session) {
        void checkOnce(session.token).catch(() => {});
      }
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [botPhase, session, checkOnce]);

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
          return;
        }
        await refresh();
        router.replace(safeNext);
      } catch {
        setError("Falló la conexión. Inténtalo de nuevo.");
        setBusyWidget(false);
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

  const working = busyWidget || miniApp || botPhase === "finishing";

  return (
    <div className="card overflow-visible p-0">
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
        onReady={onTelegramSdkReady}
      />
      <div className="overflow-hidden rounded-t-[1.35rem] bg-[linear-gradient(135deg,#229ED9_0%,#7c3aed_100%)] px-6 py-8 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">MeCuadra</p>
        <h1 className="mt-2 font-display text-3xl leading-tight">Entra con Telegram</h1>
        <p className="mt-2 text-sm text-white/90">
          Telegram te pregunta si quieres iniciar sesión y tú tocas <strong>Sí</strong>. Sin SMS y
          sin poner tu número.
        </p>
      </div>

      <div className="space-y-5 overflow-visible p-5 sm:p-6">
        {working ? (
          <div className="flex flex-col items-center gap-3 py-6" role="status">
            <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand/25 border-t-brand" />
            <p className="text-center text-sm font-medium text-ink">
              {miniApp ? "Entrando con tu cuenta de Telegram…" : "Abriendo tu sesión…"}
            </p>
          </div>
        ) : (
          <>
            <a
              href={session?.url || `https://t.me/${botUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!session}
              className={`btn-primary w-full py-3 text-base ${session ? "" : "pointer-events-none opacity-60"}`}
              onClick={() => {
                if (!session) return;
                setError("");
                setBotPhase("waiting");
                startPoll(session.token);
              }}
            >
              {session ? "Continuar con Telegram" : "Preparando acceso…"}
            </a>

            {botPhase === "waiting" ? (
              <div
                className="flex flex-col items-center gap-2 rounded-2xl border border-brand/25 bg-brand-50 px-4 py-4"
                role="status"
              >
                <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-brand/30 border-t-brand" />
                <p className="text-center text-sm font-semibold text-ink">
                  Esperando tu confirmación en Telegram…
                </p>
                <p className="text-center text-xs leading-5 text-mute">
                  En el chat de <span className="font-medium text-ink">@{botUsername}</span> toca{" "}
                  <strong className="text-ink">Iniciar</strong> y luego{" "}
                  <strong className="text-ink">✅ Sí, iniciar sesión</strong>. Esta pestaña se abre
                  sola.
                </p>
                {session ? (
                  <button
                    type="button"
                    className="text-xs font-medium text-brand underline"
                    onClick={() => void finishWithToken(session.token)}
                  >
                    Ya confirmé, continuar
                  </button>
                ) : null}
                <button
                  type="button"
                  className="text-xs text-mute underline"
                  onClick={() => {
                    stopPoll();
                    setBotPhase("idle");
                  }}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <ol className="space-y-1.5 rounded-2xl border border-line bg-surface-2 px-4 py-3 text-xs leading-5 text-mute">
                <li>1. Toca el botón: se abre el bot oficial de MeCuadra.</li>
                <li>
                  2. Pulsa <span className="font-medium text-ink">Iniciar</span>.
                </li>
                <li>
                  3. Telegram te pregunta si quieres entrar → toca{" "}
                  <span className="font-medium text-ink">Sí, iniciar sesión</span>.
                </li>
              </ol>
            )}

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            <div className="border-t border-line pt-4">
              {!showWidget ? (
                <button
                  type="button"
                  className="w-full text-center text-sm font-medium text-brand"
                  onClick={() => setShowWidget(true)}
                >
                  Otra opción: botón oficial de Telegram
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-ink">Botón oficial de Telegram</p>
                  <p className="text-xs leading-5 text-mute">
                    Este es el widget de <code>oauth.telegram.org</code>. En algunos móviles pide el
                    número y la confirmación no llega — si te pasa, usa el botón de arriba.
                  </p>
                  <TelegramLoginButton
                    botUsername={botUsername}
                    onAuth={(u) => void onWidgetAuth(u)}
                    onError={(msg) => setError(msg)}
                  />
                </div>
              )}
            </div>
          </>
        )}

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
