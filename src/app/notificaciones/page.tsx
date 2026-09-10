"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Empty, RequireAuth } from "@/components/ui";
import { timeAgo } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

export default function NotificacionesPage() {
  return (
    <RequireAuth>
      <List />
    </RequireAuth>
  );
}

function List() {
  const { t, locale } = useI18n();
  const { currentUser, notifications, markNotificationsRead } = useStore();
  const mine = notifications.filter((n) => n.userId === currentUser?.id);

  useEffect(() => {
    markNotificationsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl">{t.notifications.title}</h1>
      <ul className="mt-5 space-y-2">
        {mine.length === 0 ? (
          <Empty title={t.notifications.empty} hint={t.notifications.emptyHint} />
        ) : (
          mine.map((n) => (
            <li key={n.id}>
              <Link
                href={n.href}
                className={`card block p-4 ${n.read ? "" : "border-brand/40 bg-brand-50/40"}`}
              >
                <p className="font-semibold">{n.title}</p>
                <p className="text-sm text-mute">{n.body}</p>
                <p className="mt-1 text-xs text-mute">{timeAgo(n.createdAt, locale)}</p>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
