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

function preferredWidgetSize(): "large" | "medium" {
  if (typeof window === "undefined") return "large";
  // En móvil el botón "large" + foto suele salirse y se corta la foto.
  return window.matchMedia("(max-width: 480px)").matches ? "medium" : "large";
}

/** Botón oficial Login Widget (Telegram). Preferido por confianza. */
export function TelegramLoginButton({
  botUsername,
  onAuth,
  onError,
}: {
  botUsername: string;
  onAuth: (user: TgUser) => void;
  onError?: (message: string) => void;
  nextPath?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const onAuthRef = useRef(onAuth);
  const onErrorRef = useRef(onError);

  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    onAuthRef.current = onAuth;
    onErrorRef.current = onError;
  }, [onAuth, onError]);

  useEffect(() => {
    if (!botUsername || !host.current) return;

    let cancelled = false;
    setPhase("loading");

    window.onMeCuadraTelegramAuth = (user) => {
      onAuthRef.current(user);
    };

    const el = host.current;
    el.innerHTML = "";
    const size = preferredWidgetSize();

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
    script.setAttribute("data-size", size);
    script.setAttribute("data-radius", "14");
    script.setAttribute("data-userpic", "true");
    script.setAttribute("data-lang", "es");
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
        "No se pudo cargar el botón oficial de Telegram. Prueba la alternativa de abajo o desactiva la VPN.",
      );
    };
    el.appendChild(script);

    const timeout = window.setTimeout(() => {
      if (cancelled) return;
      if (!el.querySelector("iframe") && !el.querySelector("button")) {
        setPhase("error");
        onErrorRef.current?.(
          "El botón oficial no cargó. Usa “Acceso por el bot oficial” más abajo.",
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
    <div className="relative flex min-h-[48px] w-full flex-col items-center justify-center overflow-visible">
      {phase === "loading" ? (
        <div className="flex flex-col items-center gap-3 py-2" role="status" aria-live="polite">
          <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand/25 border-t-brand" />
          <p className="text-center text-sm font-medium text-ink">Cargando login oficial de Telegram…</p>
        </div>
      ) : null}

      <div
        ref={host}
        className={
          phase === "loading"
            ? "pointer-events-none absolute opacity-0"
            : "flex w-full max-w-full justify-center overflow-visible max-sm:origin-center max-sm:scale-[0.9]"
        }
      />

      {phase === "error" ? (
        <button
          type="button"
          className="btn-ghost mt-2 text-sm"
          onClick={() => window.location.reload()}
        >
          Reintentar botón oficial
        </button>
      ) : null}
    </div>
  );
}
