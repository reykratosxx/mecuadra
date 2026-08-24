"use client";

import { useEffect, useRef, useState } from "react";

type TgUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

declare global {
  interface Window {
    onMeCuadraTelegramAuth?: (user: TgUser) => void;
  }
}

/**
 * Login Widget como en TopEstrenos: data-onauth (callback).
 * Evita el redirect a oauth.telegram.org que pide teléfono y se queda
 * esperando un mensaje que a veces no llega.
 */
export function TelegramLoginButton({
  botUsername,
  onAuth,
  onError,
}: {
  botUsername: string;
  onAuth: (user: TgUser) => void;
  onError?: (message: string) => void;
  /** @deprecated el callback no necesita nextPath */
  nextPath?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const onAuthRef = useRef(onAuth);
  const onErrorRef = useRef(onError);
  onAuthRef.current = onAuth;
  onErrorRef.current = onError;

  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!botUsername || !host.current) return;

    let cancelled = false;
    setPhase("loading");

    window.onMeCuadraTelegramAuth = (user) => {
      onAuthRef.current(user);
    };

    const el = host.current;
    el.innerHTML = "";

    const markReady = () => {
      if (cancelled) return;
      setPhase("ready");
    };

    const observer = new MutationObserver(() => {
      if (el.querySelector("iframe") || el.querySelector("button") || el.querySelector("a")) {
        markReady();
        observer.disconnect();
      }
    });
    observer.observe(el, { childList: true, subtree: true });

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername.replace(/^@/, ""));
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "14");
    script.setAttribute("data-userpic", "true");
    // Igual que TopEstrenos: confirma en popup / app, sin forzar número.
    script.setAttribute("data-onauth", "onMeCuadraTelegramAuth(user)");
    script.onload = () => {
      window.setTimeout(() => {
        if (!cancelled && (el.querySelector("iframe") || el.querySelector("button"))) {
          markReady();
        }
      }, 400);
    };
    script.onerror = () => {
      if (cancelled) return;
      setPhase("error");
      onErrorRef.current?.(
        "No se pudo cargar Telegram. Desactiva la VPN o prueba otra red e inténtalo de nuevo.",
      );
    };
    el.appendChild(script);

    const timeout = window.setTimeout(() => {
      if (cancelled) return;
      if (!el.querySelector("iframe") && !el.querySelector("button")) {
        setPhase("error");
        onErrorRef.current?.(
          "Telegram tarda demasiado en cargar. Desactiva la VPN y recarga la página.",
        );
      } else {
        markReady();
      }
    }, 12000);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(timeout);
      el.innerHTML = "";
      delete window.onMeCuadraTelegramAuth;
    };
  }, [botUsername]);

  if (!botUsername) {
    return (
      <p className="text-sm text-rose-600">
        Falta <code>NEXT_PUBLIC_TELEGRAM_BOT_USERNAME</code> en Vercel.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex min-h-[52px] w-full flex-col items-center justify-center">
        {phase === "loading" ? (
          <div className="flex flex-col items-center gap-3 py-2" role="status" aria-live="polite">
            <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand/25 border-t-brand" />
            <p className="text-center text-sm font-medium text-ink">Preparando Telegram…</p>
            <p className="max-w-xs text-center text-xs text-mute">
              Esto puede tardar unos segundos. No cierres la página.
            </p>
          </div>
        ) : null}

        <div
          ref={host}
          className={
            phase === "loading"
              ? "pointer-events-none absolute opacity-0"
              : "flex w-full justify-center"
          }
        />

        {phase === "error" ? (
          <button
            type="button"
            className="btn-ghost mt-2 text-sm"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        ) : null}
      </div>

      <div className="w-full rounded-2xl border border-line bg-stone-50 px-4 py-3 text-left text-xs leading-5 text-mute">
        <p className="font-semibold text-ink">Cómo entrar (sin SMS ni teléfono)</p>
        <ol className="mt-1.5 list-decimal space-y-1 pl-4">
          <li>Toca el botón azul de Telegram.</li>
          <li>
            En Telegram confirma <span className="font-medium text-ink">“Aceptar”</span> / que eres
            tú — no hace falta escribir el número.
          </li>
          <li>Vuelves a MeCuadra ya con la sesión abierta.</li>
        </ol>
        <p className="mt-2 text-[11px] text-mute">
          Si el navegador bloquea ventanas emergentes, permítelas para mecuadra.vercel.app. Con VPN
          a veces falla: pruébalo un momento sin ella.
        </p>
      </div>
    </div>
  );
}
