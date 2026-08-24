"use client";

import { useEffect, useRef } from "react";

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

  useEffect(() => {
    if (!botUsername || !host.current) return;

    // Callback en página: si Telegram abre el popup y vuelve sin navegación completa.
    window.onMeCuadraTelegramAuth = (user) => {
      onAuthRef.current(user);
    };

    const safeNext = nextPath.startsWith("/") ? nextPath : "/explorar";
    // Redirect: más fiable con VPN / bloqueo de scripts de terceros.
    const authUrl = `${window.location.origin}/auth/telegram?next=${encodeURIComponent(safeNext)}`;

    host.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "14");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-userpic", "true");
    script.setAttribute("data-auth-url", authUrl);
    script.onerror = () =>
      onErrorRef.current?.(
        "No se pudo cargar Telegram. Desactiva la VPN o prueba otra red e inténtalo de nuevo.",
      );
    host.current.appendChild(script);

    return () => {
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
    <div className="flex flex-col items-center gap-3">
      <div ref={host} className="min-h-[44px]" />
      <p className="text-center text-xs text-mute">
        Telegram confirma que eres tú. Si el botón no carga o se queda colgado, desactiva
        la VPN un momento — a menudo bloquea telegram.org.
      </p>
    </div>
  );
}
