"use client";

import { useStore } from "@/lib/store";
import { cn, initials } from "@/lib/utils";

export function Stars({
  value,
  count,
  size = "sm",
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const w = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <span className="inline-flex items-center gap-1 text-amber-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cn(w, i + 1 <= Math.round(value) ? "fill-current" : "fill-stone-200 text-stone-200")}
          viewBox="0 0 24 24"
        >
          <path d="m12 3.6 2.5 5.1 5.6.8-4 3.9.9 5.6L12 16.4 6.9 19l.9-5.6-4-3.9 5.6-.8L12 3.6Z" />
        </svg>
      ))}
      {typeof count === "number" ? (
        <span className="ml-0.5 text-xs text-mute">
          {value.toFixed(1)} · {count}
        </span>
      ) : null}
    </span>
  );
}

export function Avatar({
  src,
  name,
  size = 40,
}: {
  src?: string;
  name: string;
  size?: number;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-50 font-semibold text-brand ring-2 ring-surface"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}

export function Badge({
  children,
  tone = "brand",
}: {
  children: React.ReactNode;
  tone?: "brand" | "ok" | "warn" | "mute";
}) {
  const map = {
    brand: "bg-brand-50 text-brand",
    ok: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-700",
    mute: "bg-surface-2 text-mute",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", map[tone])}>
      {children}
    </span>
  );
}

export function Empty({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card px-6 py-12 text-center">
      <p className="font-display text-lg text-ink">{title}</p>
      {hint ? <p className="mt-1 text-sm text-mute">{hint}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { currentUser, ready } = useStore();
  if (!ready) return <p className="py-12 text-center text-sm text-mute">Cargando…</p>;
  if (!currentUser) {
    return (
      <Empty
        title="Entra con Telegram para continuar"
        hint="El mercado es libre. Publicar, aplicar y chatear piden tu cuenta de Telegram."
        action={
          <a href="/login" className="btn-primary">
            Entrar con Telegram
          </a>
        }
      />
    );
  }
  return <>{children}</>;
}
