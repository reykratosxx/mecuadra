"use client";

import Link from "next/link";
import { TRANSPORT_LABEL } from "@/lib/cuba";
import { categoryLabel } from "@/lib/categories";
import type { Offer } from "@/lib/types";
import { useStore } from "@/lib/store";
import { timeAgo } from "@/lib/utils";
import { Avatar, Badge, Stars } from "./ui";
import { IconArrows, IconPin, IconShield, IconTruck } from "./icons";

export function OfferCard({ offer }: { offer: Offer }) {
  const { users, items } = useStore();
  const owner = users.find((u) => u.id === offer.userId);
  const offered = items.filter((i) => offer.itemIds.includes(i.id));
  const cover = offered[0]?.photos[0] ?? "/logo.png";

  return (
    <Link
      href={`/oferta/${offer.id}`}
      className="card group overflow-hidden transition hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-lg hover:shadow-brand/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={offered[0]?.title ?? "Oferta"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {offer.featured ? (
          <span className="absolute left-3 top-3 rounded-full bg-[image:var(--grad)] px-2.5 py-1 text-[11px] font-semibold text-white">
            Destacada
          </span>
        ) : null}
        <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] text-white backdrop-blur">
          {offered.length} {offered.length === 1 ? "artículo" : "artículos"}
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Avatar src={owner?.avatar} name={owner?.name ?? "?"} size={28} />
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-ink">
                {owner?.name}
                {owner?.verified ? <IconShield className="h-3.5 w-3.5 text-brand" /> : null}
              </p>
              {owner ? <Stars value={owner.ratingAvg} count={owner.ratingCount} /> : null}
            </div>
          </div>
          <span className="text-[11px] text-mute">{timeAgo(offer.createdAt)}</span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-mute">Ofrece</p>
            <p className="line-clamp-2 text-sm font-medium text-ink">
              {offered.map((i) => i.title).join(" · ") || "Sin artículos"}
            </p>
          </div>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-brand">
            <IconArrows className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-mute">Necesita</p>
            <p className="line-clamp-2 text-sm font-medium text-ink">
              {offer.wants.map((w) => w.title).join(" · ")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {offer.openToProposals ? <Badge>Escucha propuestas</Badge> : null}
          {offered[0] ? <Badge tone="mute">{categoryLabel(offered[0].category)}</Badge> : null}
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-mute">
            <IconPin className="h-3.5 w-3.5" />
            {offer.neighborhood || offer.municipality}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-mute">
            <IconTruck className="h-3.5 w-3.5" />
            {TRANSPORT_LABEL[offer.transport].split("·")[0]}
          </span>
        </div>
      </div>
    </Link>
  );
}
