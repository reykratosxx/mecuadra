"use client";

import { useEffect, useRef, useState } from "react";
import { COMMUNITY_TELEGRAM, SOCIAL_FACEBOOK, SOCIAL_X, SUPPORT_TELEGRAM } from "@/lib/support";
import { IconTelegram } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/provider";

export function SupportMenu() {
  const t = useT();
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
            {t.footer.helpTitle}
          </p>
          <a
            href={SUPPORT_TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2.5 text-sm font-medium text-ink hover:bg-hover"
            onClick={() => setOpen(false)}
          >
            {t.footer.helpSupport}
            <span className="mt-0.5 block text-xs font-normal text-mute">@alainleonids</span>
          </a>
          <a
            href={COMMUNITY_TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-t border-line px-3 py-2.5 text-sm font-medium text-ink hover:bg-hover"
            onClick={() => setOpen(false)}
          >
            {t.footer.helpCommunity}
            <span className="mt-0.5 block text-xs font-normal text-mute">t.me/mecuadrachat</span>
          </a>
          <a
            href={SOCIAL_X}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-t border-line px-3 py-2.5 text-sm font-medium text-ink hover:bg-hover"
            onClick={() => setOpen(false)}
          >
            {t.footer.helpX}
            <span className="mt-0.5 block text-xs font-normal text-mute">@mecuadraoficial</span>
          </a>
          <a
            href={SOCIAL_FACEBOOK}
            target="_blank"
            rel="noopener noreferrer"
            className="block border-t border-line px-3 py-2.5 text-sm font-medium text-ink hover:bg-hover"
            onClick={() => setOpen(false)}
          >
            {t.footer.helpFacebook}
            <span className="mt-0.5 block text-xs font-normal text-mute">facebook.com/groups</span>
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
        aria-label={open ? t.footer.helpClose : t.footer.helpOpen}
      >
        <IconTelegram className="h-4 w-4" />
        {t.footer.help}
      </button>
    </div>
  );
}
