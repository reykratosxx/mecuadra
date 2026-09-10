"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Avatar, Badge, Empty, RequireAuth } from "@/components/ui";
import { timeAgo } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

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
  const { t, locale } = useI18n();
  const { currentUser, trades, offers, items, users } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("aceptados");
  const uid = currentUser!.id;

  const tabs = [
    { id: "aceptados" as const, label: t.trades.accepted },
    { id: "recibidos" as const, label: t.trades.received },
    { id: "enviados" as const, label: t.trades.sent },
  ];

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
      <h1 className="font-display text-3xl">{t.trades.title}</h1>
      <p className="text-mute">{t.trades.lead}</p>
      <div className="mt-5 flex rounded-2xl bg-surface-2 p-1">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            type="button"
            onClick={() => setTab(tabItem.id)}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
              tab === tabItem.id ? "bg-surface text-brand shadow-sm" : "text-mute"
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>
      <ul className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <Empty title={t.trades.empty} hint={t.trades.emptyHint} />
        ) : (
          filtered.map((tr) => {
            const otherId = tr.ownerId === uid ? tr.applicantId : tr.ownerId;
            const other = users.find((u) => u.id === otherId);
            const offer = offers.find((o) => o.id === tr.offerId);
            const offered = items.filter((i) => offer?.itemIds.includes(i.id));
            const proposed = items.filter((i) => tr.proposedItemIds.includes(i.id));
            const statusLabel = t.trades[tr.status as keyof typeof t.trades] ?? tr.status;
            return (
              <li key={tr.id} className="card p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar src={other?.avatar} name={other?.name ?? "?"} size={40} />
                    <div>
                      <p className="font-semibold">{other?.name}</p>
                      <p className="text-xs text-mute">{timeAgo(tr.updatedAt, locale)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      tone={
                        tr.status === "completado"
                          ? "ok"
                          : tr.status === "rechazado" || tr.status === "cancelado"
                            ? "warn"
                            : "brand"
                      }
                    >
                      {statusLabel}
                    </Badge>
                    <Link href={`/chat/${tr.id}`} className="btn-primary !py-1.5 !px-3 text-xs">
                      Chat
                    </Link>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
                  <div>
                    <p className="text-[10px] uppercase text-mute">{t.trades.wants}</p>
                    <p className="font-medium">{offered.map((i) => i.title).join(" · ") || t.trades.offerFallback}</p>
                  </div>
                  <span className="text-brand">⇄</span>
                  <div>
                    <p className="text-[10px] uppercase text-mute">{t.trades.offers}</p>
                    <p className="font-medium">
                      {proposed.map((i) => i.title).join(" · ") || tr.proposalNote || t.trades.proposal}
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
