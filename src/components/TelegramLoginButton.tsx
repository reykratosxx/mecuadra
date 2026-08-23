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
}: {
  botUsername: string;
  onAuth: (user: TgUser) => void;
  onError?: (message: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!botUsername || !host.current) return;

    window.onMeCuadraTelegramAuth = (user) => {
      onAuth(user);
    };

    host.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "14");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-userpic", "true");
    script.setAttribute("data-onauth", "onMeCuadraTelegramAuth(user)");
    script.onerror = () => onError?.("No se pudo cargar el widget de Telegram.");
    host.current.appendChild(script);

    return () => {
      delete window.onMeCuadraTelegramAuth;
    };
  }, [botUsername, onAuth, onError]);

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
        Telegram confirma que eres tú. Sin contraseñas ni SMS.
      </p>
    </div>
  );
}
