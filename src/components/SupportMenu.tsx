"use client";

import { useEffect, useRef, useState } from "react";
import { COMMUNITY_TELEGRAM, SUPPORT_TELEGRAM } from "@/lib/support";
import { cn } from "@/lib/utils";

export function SupportMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent | TouchEvent) {
      const el = rootRef.current;
      if (el && e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="fixed bottom-[5.5rem] right-3 z-40 md:bottom-6 md:right-5"
    >
      {open ? (
        <div className="mb-2 w-56 overflow-hidden rounded-2xl border border-line bg-surface shadow-xl shadow-brand/10">
          <p className="border-b border-line px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-mute">
            Ayuda MeCuadra
          </p>
          <a
            href={SUPPORT_TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2.5 text-sm font-medium text-ink hover:bg-hover"
            onClick={() => setOpen(false)}
          >
            Soporte en Telegram
            <span className="mt-0.5 block text-xs font-normal text-mute">@alainleonids</span>
          </a>
          <a
            href={COMMUNITY_TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-t border-line px-3 py-2.5 text-sm font-medium text-ink hover:bg-hover"
            onClick={() => setOpen(false)}
          >
            Grupo de la comunidad
            <span className="mt-0.5 block text-xs font-normal text-mute">t.me/mecuadrachat</span>
          </a>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-11 items-center gap-2 rounded-full px-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/35",
          "bg-[image:var(--grad)]",
        )}
        aria-expanded={open}
        aria-label={open ? "Cerrar menú de ayuda" : "Abrir menú de ayuda"}
      >
        <TelegramGlyph className="h-4 w-4" />
        Ayuda
      </button>
    </div>
  );
}

function TelegramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M21.5 4.4 3.7 11.2c-1.2.5-1.2 1.2-.2 1.5l4.6 1.4 10.6-6.7c.5-.3 1-.1.6.2l-8.6 7.8-.3 4.6c.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.2-.5-1.8-1.4-1.4Z" />
    </svg>
  );
}
