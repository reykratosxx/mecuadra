"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DOC_SEARCH } from "@/lib/docs";
import { IconSearch, IconX } from "@/components/icons";

export function DocsSearch({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return DOC_SEARCH;
    return DOC_SEARCH.filter(
      (d) =>
        d.title.toLowerCase().includes(s) ||
        d.hint.toLowerCase().includes(s) ||
        d.group.toLowerCase().includes(s),
    );
  }, [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-[#1c1428]/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-auto mt-[12vh] max-w-lg overflow-hidden rounded-3xl border border-line bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-line px-4">
          <IconSearch className="h-4 w-4 text-mute" />
          <input
            autoFocus
            className="h-12 flex-1 bg-transparent text-sm outline-none"
            placeholder="Busca trueque, correo, cifrado, API…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <IconX className="h-4 w-4" />
          </button>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-mute">Nada con esa palabra.</li>
          ) : (
            results.map((r) => (
              <li key={r.href}>
                <button
                  type="button"
                  className="w-full rounded-2xl px-3 py-2.5 text-left hover:bg-brand-50"
                  onClick={() => {
                    router.push(r.href);
                    onClose();
                  }}
                >
                  <span className="block text-sm font-semibold">{r.title}</span>
                  <span className="text-xs text-mute">
                    {r.group} · {r.hint}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
