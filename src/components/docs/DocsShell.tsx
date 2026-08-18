"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { IconSearch } from "@/components/icons";
import { DOC_GROUPS } from "@/lib/docs";
import { cn } from "@/lib/utils";
import { DocsSearch } from "./DocsSearch";
import { DocsHotkeys } from "./DocsHotkeys";
import { DocsPager } from "./DocsPager";
import { useState } from "react";

export function DocsShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  return (
    <div className="docs-root min-h-full">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-[#fbf7ff]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4">
          <Logo withWord size={30} />
          <span className="hidden rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-brand sm:inline">
            Docs
          </span>
          <button
            type="button"
            data-docs-search
            className="ml-auto flex h-9 items-center gap-2 rounded-full border border-line bg-white px-3 text-sm text-mute"
            onClick={() => setOpen(true)}
          >
            <IconSearch className="h-4 w-4" />
            <span className="hidden sm:inline">Buscar en las docs</span>
            <kbd className="hidden rounded-md border border-line px-1.5 text-[10px] sm:inline">⌘K</kbd>
          </button>
          <button type="button" className="docs-menu-btn lg:hidden" onClick={() => setMenu((v) => !v)}>
            Índice
          </button>
          <Link href="/explorar" className="hidden text-sm font-semibold text-brand sm:inline">
            Ir al mercado
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside
          className={cn(
            "docs-aside border-line lg:sticky lg:top-14 lg:block lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto lg:border-r",
            menu ? "block border-b bg-[#fbf7ff] px-4 py-4" : "hidden px-4 py-6 lg:block",
          )}
        >
          {DOC_GROUPS.map((g) => (
            <div key={g.title} className="mb-6">
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">
                {g.title}
              </p>
              <ul className="space-y-0.5">
                {g.items.map((item) => {
                  const active = path === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenu(false)}
                        className={cn(
                          "block rounded-xl px-2 py-1.5 text-sm transition",
                          active
                            ? "bg-white font-semibold text-brand shadow-sm ring-1 ring-brand/15"
                            : "text-mute hover:bg-white/70 hover:text-ink",
                        )}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </aside>
        <div className="min-w-0 px-4 py-8 sm:px-8 lg:px-12">
          {children}
          <DocsPager />
        </div>
      </div>
      {open ? <DocsSearch onClose={() => setOpen(false)} /> : null}
      <DocsHotkeys />
    </div>
  );
}
