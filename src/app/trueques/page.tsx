"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Avatar, Badge, Empty, RequireAuth } from "@/components/ui";
import { timeAgo } from "@/lib/utils";

const TABS = [
  { id: "aceptados", label: "Aceptados" },
  { id: "recibidos", label: "Recibidos" },
  { id: "enviados", label: "Enviados" },
] as const;

export default function TruequesPage() {
  return (
    <RequireAuth>
      <Board />
    </RequireAuth>
  );
}

function Board() {
  const { currentUser, trades, offers, items, users } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("aceptados");
  const uid = currentUser!.id;

  const filtered = trades.filter((t) => {
    if (tab === "aceptados") {
      return (
        (t.ownerId === uid || t.applicantId === uid) &&
        ["aceptado", "entregado", "completado"].includes(t.status)
      );
    }
    if (tab === "recibidos") return t.ownerId === uid;
    return t.applicantId === uid;
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Mis trueques</h1>
      <p className="text-mute">Aceptados, recibidos y enviados — el flujo P2P completo.</p>
      <div className="mt-5 flex rounded-2xl bg-stone-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
              tab === t.id ? "bg-white text-brand shadow-sm" : "text-mute"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <ul className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <Empty title="Nada en esta bandeja" hint="Cuando alguien toque MeCuadra, aparece aquí." />
        ) : (
          filtered.map((t) => {
            const otherId = t.ownerId === uid ? t.applicantId : t.ownerId;
            const other = users.find((u) => u.id === otherId);
            const offer = offers.find((o) => o.id === t.offerId);
            const offered = items.filter((i) => offer?.itemIds.includes(i.id));
            const proposed = items.filter((i) => t.proposedItemIds.includes(i.id));
            return (
              <li key={t.id} className="card p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar src={other?.avatar} name={other?.name ?? "?"} size={40} />
                    <div>
                      <p className="font-semibold">{other?.name}</p>
                      <p className="text-xs text-mute">{timeAgo(t.updatedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      tone={
                        t.status === "completado"
                          ? "ok"
                          : t.status === "rechazado" || t.status === "cancelado"
                            ? "warn"
                            : "brand"
                      }
                    >
                      {t.status}
                    </Badge>
                    <Link href={`/chat/${t.id}`} className="btn-primary !py-1.5 !px-3 text-xs">
                      Chat
                    </Link>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
                  <div>
                    <p className="text-[10px] uppercase text-mute">Quiere</p>
                    <p className="font-medium">{offered.map((i) => i.title).join(" · ") || "Oferta"}</p>
                  </div>
                  <span className="text-brand">⇄</span>
                  <div>
                    <p className="text-[10px] uppercase text-mute">Ofrece</p>
                    <p className="font-medium">
                      {proposed.map((i) => i.title).join(" · ") || t.proposalNote || "Propuesta"}
                    </p>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
