"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Badge, Empty, RequireAuth } from "@/components/ui";
import { categoryLabel } from "@/lib/categories";
import type { ItemStatus } from "@/lib/types";

const STATUS_LABEL: Record<ItemStatus, string> = {
  activo: "Activo",
  pausado: "Pausado",
  canjeado: "Eliminado",
};

export default function ArticulosPage() {
  return (
    <RequireAuth>
      <List />
    </RequireAuth>
  );
}

function List() {
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
      setError(e instanceof Error ? e.message : "No se pudo actualizar el artículo.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">Mis artículos</h1>
          <p className="text-sm text-mute">Edita, pausa o elimina lo que ya no ofreces.</p>
        </div>
        <Link href="/articulos/nuevo" className="btn-primary">
          Nuevo
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          className={`rounded-full px-3 py-1.5 font-medium ${
            !showGone ? "bg-brand-50 text-brand" : "text-mute hover:bg-stone-50"
          }`}
          onClick={() => setShowGone(false)}
        >
          En inventario ({mine.length - goneCount})
        </button>
        <button
          type="button"
          className={`rounded-full px-3 py-1.5 font-medium ${
            showGone ? "bg-brand-50 text-brand" : "text-mute hover:bg-stone-50"
          }`}
          onClick={() => setShowGone(true)}
        >
          Eliminados ({goneCount})
        </button>
      </div>

      {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}

      {visible.length === 0 ? (
        <Empty
          title={showGone ? "No hay eliminados" : "Todavía no tienes artículos"}
          hint={
            showGone
              ? "Los artículos que elimines aparecen aquí por si quieres reactivarlos."
              : "Publica lo que puedes cambiar. Luego arma la oferta."
          }
          action={
            showGone ? undefined : (
              <Link href="/articulos/nuevo" className="btn-primary">
                Añadir artículo
              </Link>
            )
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {visible.map((item) => (
            <li key={item.id} className="card flex gap-3 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.photos[0] || "/logo.png"}
                alt=""
                className="h-24 w-24 shrink-0 rounded-2xl object-cover bg-stone-100"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{item.title}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge>{categoryLabel(item.category)}</Badge>
                  <Badge tone={item.status === "activo" ? "ok" : "mute"}>
                    {STATUS_LABEL[item.status]}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold">
                  {item.status !== "canjeado" ? (
                    <>
                      <Link href={`/articulos/${item.id}/editar`} className="text-brand">
                        Editar
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
                        {item.status === "activo" ? "Pausar" : "Reactivar"}
                      </button>
                      <button
                        type="button"
                        className="text-rose-600 disabled:opacity-50"
                        disabled={busyId === item.id}
                        onClick={() => {
                          if (
                            !window.confirm(
                              "¿Eliminar este artículo? Deja de aparecer al publicar ofertas.",
                            )
                          ) {
                            return;
                          }
                          void setStatus(item.id, "canjeado");
                        }}
                      >
                        {busyId === item.id ? "…" : "Eliminar"}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="text-brand disabled:opacity-50"
                      disabled={busyId === item.id}
                      onClick={() => void setStatus(item.id, "activo")}
                    >
                      Restaurar
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
