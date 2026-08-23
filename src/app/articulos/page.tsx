"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Badge, Empty, RequireAuth } from "@/components/ui";
import { categoryLabel } from "@/lib/categories";

export default function ArticulosPage() {
  return (
    <RequireAuth>
      <List />
    </RequireAuth>
  );
}

function List() {
  const { currentUser, items, updateItem } = useStore();
  const mine = items.filter((i) => i.userId === currentUser?.id);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl">Mis artículos</h1>
          <p className="text-mute">Pausa, edita o da de baja. Me Sirve no dejaba hacer esto.</p>
        </div>
        <Link href="/articulos/nuevo" className="btn-primary">
          Nuevo
        </Link>
      </div>
      {mine.length === 0 ? (
        <Empty
          title="Todavía no tienes artículos"
          hint="Publica lo que puedes cambiar. Luego arma la oferta."
          action={
            <Link href="/articulos/nuevo" className="btn-primary">
              Añadir artículo
            </Link>
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {mine.map((item) => (
            <li key={item.id} className="card flex gap-3 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.photos[0]} alt="" className="h-24 w-24 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{item.title}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Badge>{categoryLabel(item.category)}</Badge>
                  <Badge tone={item.status === "activo" ? "ok" : "mute"}>{item.status}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    className="text-brand"
                    onClick={() =>
                      void updateItem(item.id, {
                        status: item.status === "activo" ? "pausado" : "activo",
                      })
                    }
                  >
                    {item.status === "activo" ? "Pausar" : "Reactivar"}
                  </button>
                  <button
                    type="button"
                    className="text-rose-600"
                    hidden={item.status === "canjeado"}
                    onClick={() => {
                      if (
                        !window.confirm(
                          "¿Eliminar este artículo? Desaparece de publicar oferta y del mercado.",
                        )
                      ) {
                        return;
                      }
                      void updateItem(item.id, { status: "canjeado" });
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
