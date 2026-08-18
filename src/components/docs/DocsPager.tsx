"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { flattenDocs } from "@/lib/docs";

export function DocsPager() {
  const path = usePathname();
  const list = flattenDocs();
  const i = list.findIndex((d) => d.href === path);
  if (i < 0) return null;
  const prev = list[i - 1];
  const next = list[i + 1];
  return (
    <nav className="mt-14 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
      {prev ? (
        <Link href={prev.href} className="card p-4 hover:border-brand/30">
          <p className="text-[11px] uppercase tracking-wider text-mute">Anterior</p>
          <p className="font-display text-lg">{prev.title}</p>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="card p-4 text-right hover:border-brand/30">
          <p className="text-[11px] uppercase tracking-wider text-mute">Siguiente</p>
          <p className="font-display text-lg">{next.title}</p>
        </Link>
      ) : null}
    </nav>
  );
}
