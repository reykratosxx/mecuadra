"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Badge, Empty, RequireAuth } from "@/components/ui";
import { categoryLabel } from "@/lib/categories";
import type { ItemStatus } from "@/lib/types";
import { displayTitle } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

export default function ArticulosPage() {
  return (
    <RequireAuth>
      <List />
    </RequireAuth>
  );
}

function List() {
  const { t, locale } = useI18n();
  const { currentUser, items, updateItem } = useStore();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showGone, setShowGone] = useState(false);

  const mine = items.filter((i) => i.userId === currentUser?.id);
  const visible = mine.filter((i) =>
    showGone ? i.status === "canjeado" : i.status !== "canjeado",
  );
  const goneCount = mine.filter((i) => i.status === "canjeado").length;

  async function setStatus(id: string, status: ItemStatus) {
    setBusyId(id);
    setError("");
    try {
      await updateItem(id, { status });
    } catch (e) {
      setError(e instanceof Error ? e.message : t.items.updateFail);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">{t.items.title}</h1>
          <p className="text-sm text-mute">{t.items.lead}</p>
        </div>
        <Link href="/articulos/nuevo" className="btn-primary">
          {t.items.new}
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          className={`rounded-full px-3 py-1.5 font-medium ${
            !showGone ? "bg-brand-50 text-brand" : "text-mute hover:bg-hover"
          }`}
          onClick={() => setShowGone(false)}
        >
          {t.items.inventory} ({mine.length - goneCount})
        </button>
        <button
          type="button"
          className={`rounded-full px-3 py-1.5 font-medium ${
            showGone ? "bg-brand-50 text-brand" : "text-mute hover:bg-hover"
          }`}
          onClick={() => setShowGone(true)}
        >
          {t.items.removed} ({goneCount})
        </button>
      </div>

      {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}

      {visible.length === 0 ? (
        <Empty
          title={showGone ? t.items.emptyGone : t.items.empty}
          hint={showGone ? t.items.emptyGoneHint : t.items.emptyHint}
          action={
            showGone ? undefined : (
              <Link href="/articulos/nuevo" className="btn-primary">
                {t.items.add}
              </Link>
            )
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {visible.map((item) => (
            <li key={item.id} className="card flex min-w-0 gap-3 overflow-hidden p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.photos[0] || "/logo.png"}
                alt=""
                className="h-20 w-20 shrink-0 rounded-2xl object-cover bg-surface-2 sm:h-24 sm:w-24"
              />
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="break-words text-sm font-semibold leading-snug text-ink sm:text-base">
                  {displayTitle(item.title)}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge>{categoryLabel(item.category, locale)}</Badge>
                  <Badge tone={item.status === "activo" ? "ok" : "mute"}>
                    {item.status === "activo"
                      ? t.items.statusActive
                      : item.status === "pausado"
                        ? t.items.statusPaused
                        : t.items.statusGone}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold">
                  {item.status !== "canjeado" ? (
                    <>
                      <Link href={`/articulos/${item.id}/editar`} className="text-brand">
                        {t.common.edit}
                      </Link>
                      <button
                        type="button"
                        className="text-brand disabled:opacity-50"
                        disabled={busyId === item.id}
                        onClick={() =>
                          void setStatus(
                            item.id,
                            item.status === "activo" ? "pausado" : "activo",
                          )
                        }
                      >
                        {item.status === "activo" ? t.items.pause : t.items.resume}
                      </button>
                      <button
                        type="button"
                        className="text-rose-600 disabled:opacity-50"
                        disabled={busyId === item.id}
                        onClick={() => {
                          if (!window.confirm(t.items.confirmDelete)) {
                            return;
                          }
                          void setStatus(item.id, "canjeado");
                        }}
                      >
                        {busyId === item.id ? "…" : t.common.delete}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="text-brand disabled:opacity-50"
                      disabled={busyId === item.id}
                      onClick={() => void setStatus(item.id, "activo")}
                    >
                      {t.items.restore}
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
