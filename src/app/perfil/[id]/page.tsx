"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useStore } from "@/lib/store";
import { Avatar, Stars } from "@/components/ui";
import { OfferCard } from "@/components/OfferCard";
import { IconShield } from "@/components/icons";
import { useT } from "@/lib/i18n/provider";

export default function PublicProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useT();
  const { users, offers, ready } = useStore();
  const user = users.find((u) => u.id === id || u.username === id);
  if (!ready) return <div className="py-16 text-center text-mute">{t.common.loading}</div>;
  if (!user) notFound();
  const list = offers.filter((o) => o.userId === user.id && o.status === "abierta");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card mb-6 flex items-center gap-4 p-5">
        <Avatar src={user.avatar} name={user.name} size={72} />
        <div>
          <p className="flex items-center gap-1 font-display text-2xl">
            {user.name}
            {user.verified ? <IconShield className="h-5 w-5 text-brand" /> : null}
          </p>
          <p className="text-sm text-mute">
            @{user.username} · {user.neighborhood || user.municipality}, {user.province}
          </p>
          <Stars value={user.ratingAvg} count={user.ratingCount} size="md" />
          <p className="mt-1 text-xs text-mute">
            {user.tradesCompleted} {user.tradesCompleted === 1 ? t.profile.tradesDoneOne : t.profile.tradesDoneMany}
            {user.bio ? ` · ${user.bio}` : ""}
          </p>
        </div>
      </div>
      <h2 className="mb-3 font-display text-xl">{t.home.featured}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((o) => (
          <OfferCard key={o.id} offer={o} />
        ))}
      </div>
    </div>
  );
}
