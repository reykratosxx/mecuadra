"use client";

import { useState } from "react";

export function CodeBlock({
  code,
  label = "bash",
}: {
  code: string;
  label?: string;
}) {
  const [ok, setOk] = useState(false);
  return (
    <div className="docs-code">
      <div className="docs-code-bar">
        <span>{label}</span>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(code);
            setOk(true);
            setTimeout(() => setOk(false), 1200);
          }}
        >
          {ok ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Callout({
  title,
  children,
  tone = "brand",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "brand" | "ok" | "warn";
}) {
  const map = {
    brand: "border-brand/20 bg-brand-50/80",
    ok: "border-emerald-200 bg-emerald-50/80",
    warn: "border-amber-200 bg-amber-50/80",
  };
  return (
    <aside className={`my-6 rounded-2xl border p-4 ${map[tone]}`}>
      <p className="text-sm font-semibold text-ink">{title}</p>
      <div className="mt-1 text-sm leading-6 text-mute">{children}</div>
    </aside>
  );
}

export function Steps({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="docs-steps">
      {items.map((s, i) => (
        <li key={s.title}>
          <span className="docs-hex">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function DocHero({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: string;
  lead: string;
}) {
  return (
    <header className="mb-10">
      <p className="docs-kicker">{kicker}</p>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-mute">{lead}</p>
    </header>
  );
}
