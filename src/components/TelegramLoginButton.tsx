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

export function TelegramLoginButton({
  botUsername,
  onAuth,
  onError,
  nextPath = "/explorar",
}: {
  botUsername: string;
  onAuth: (user: TgUser) => void;
  onError?: (message: string) => void;
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

    const safeNext = nextPath.startsWith("/") ? nextPath : "/explorar";
    const authUrl = `${window.location.origin}/auth/telegram?next=${encodeURIComponent(safeNext)}`;

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
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "14");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-userpic", "true");
    script.setAttribute("data-auth-url", authUrl);
    script.onload = () => {
      // El iframe llega un poco después del script.
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
      delete window.onMeCuadraTelegramAuth;
    };
  }, [botUsername, nextPath]);

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
          className={phase === "loading" ? "pointer-events-none absolute opacity-0" : ""}
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
        <p className="font-semibold text-ink">No llega ningún SMS</p>
        <ol className="mt-1.5 list-decimal space-y-1 pl-4">
          <li>Toca el botón azul de Telegram.</li>
          <li>Escribe tu número con <span className="font-medium text-ink">+53</span>.</li>
          <li>
            Abre la <span className="font-medium text-ink">app de Telegram</span> y confirma el
            acceso — el aviso llega ahí, no por mensaje de texto.
          </li>
        </ol>
      </div>
    </div>
  );
}
