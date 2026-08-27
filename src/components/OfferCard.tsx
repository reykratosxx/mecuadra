"use client";

import Link from "next/link";
import { TRANSPORT_LABEL } from "@/lib/cuba";
import { categoryLabel } from "@/lib/categories";
import type { Offer } from "@/lib/types";
import { useStore } from "@/lib/store";
import { timeAgo, formatDateTime, wasEdited, displayTitle } from "@/lib/utils";
import { Avatar, Badge, Stars } from "./ui";
import { IconArrows, IconPin, IconShield, IconTruck } from "./icons";
import { buildOfferShare } from "@/lib/share";

export function OfferCard({ offer }: { offer: Offer }) {
  const { users, items } = useStore();
  const owner = users.find((u) => u.id === offer.userId);
  const offered = items.filter((i) => offer.itemIds.includes(i.id));
  const cover = offered[0]?.photos[0] ?? "/logo.png";
  const edited = wasEdited(offer.createdAt, offer.updatedAt);

  return (
    <article className="card group overflow-hidden transition hover:border-brand/25 hover:shadow-md hover:shadow-brand/5">
      <Link href={`/oferta/${offer.id}`} className="block">
        <div className="relative aspect-[2/1] overflow-hidden bg-surface-2 sm:aspect-[16/10]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={offered[0]?.title ?? "Oferta"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          {offer.featured ? (
            <span className="absolute left-2 top-2 rounded-full bg-[image:var(--grad)] px-2 py-0.5 text-[10px] font-semibold text-white sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
              Destacada
            </span>
          ) : null}
          <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] text-white backdrop-blur sm:bottom-3 sm:left-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
            {offered.length} {offered.length === 1 ? "artículo" : "artículos"}
          </span>
        </div>
        <div className="space-y-1.5 p-2.5 sm:space-y-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              <Avatar src={owner?.avatar} name={owner?.name ?? "?"} size={22} />
              <div className="min-w-0">
                <p className="flex items-center gap-1 truncate text-[13px] font-medium text-ink sm:text-sm">
                  {owner?.name}
                  {owner?.verified ? <IconShield className="h-3 w-3 shrink-0 text-brand sm:h-3.5 sm:w-3.5" /> : null}
                </p>
                <span className="hidden sm:inline">{owner ? <Stars value={owner.ratingAvg} count={owner.ratingCount} /> : null}</span>
              </div>
            </div>
            <div className="shrink-0 text-right text-[10px] leading-tight text-mute sm:text-[11px]">
              <p title={formatDateTime(offer.createdAt)}>{timeAgo(offer.createdAt)}</p>
              {edited ? (
                <p className="text-brand/80" title={formatDateTime(offer.updatedAt || offer.createdAt)}>
                  Editada {timeAgo(offer.updatedAt || offer.createdAt)}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1 sm:gap-2">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-mute sm:text-[10px]">Ofrece</p>
              <p className="line-clamp-2 break-words text-xs font-medium text-ink sm:text-sm">
                {offered.map((i) => displayTitle(i.title)).join(" · ") || "Sin artículos"}
              </p>
            </div>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-50 text-brand sm:h-8 sm:w-8">
              <IconArrows className="h-3 w-3 sm:h-4 sm:w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-mute sm:text-[10px]">Necesita</p>
              <p className="line-clamp-2 break-words text-xs font-medium text-ink sm:text-sm">
                {offer.wants.map((w) => displayTitle(w.title)).join(" · ")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            {offer.openToProposals ? <Badge>Escucha propuestas</Badge> : null}
            {offered[0] ? <Badge tone="mute">{categoryLabel(offered[0].category)}</Badge> : null}
            <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-mute sm:text-[11px]">
              <IconPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              {offer.neighborhood || offer.municipality}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-mute sm:text-[11px]">
              <IconTruck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              {TRANSPORT_LABEL[offer.transport].split("·")[0]}
            </span>
          </div>
        </div>
      </Link>
      <ShareStrip offer={offer} titles={offered.map((i) => i.title)} />
    </article>
  );
}

function ShareStrip({ offer, titles }: { offer: Offer; titles: string[] }) {
  function go(kind: "telegram" | "whatsapp" | "facebook") {
    const origin = window.location.origin;
    const place = [offer.neighborhood, offer.municipality].filter(Boolean).join(", ");
    const pack = buildOfferShare({
      origin,
      offerId: offer.id,
      offered: titles,
      wants: offer.wants.map((w) => w.title),
      place,
      transport: TRANSPORT_LABEL[offer.transport],
    });
    window.open(pack[kind], "_blank", "noopener,noreferrer,width=640,height=720");
  }
  return (
    <div className="flex border-t border-line">
      <button type="button" className="flex-1 py-1.5 text-center text-[10px] font-semibold text-mute hover:bg-brand-50 sm:py-2 sm:text-[11px]" onClick={() => go("telegram")}>
        Telegram
      </button>
      <button type="button" className="flex-1 border-x border-line py-1.5 text-center text-[10px] font-semibold text-mute hover:bg-brand-50 sm:py-2 sm:text-[11px]" onClick={() => go("whatsapp")}>
        WhatsApp
      </button>
      <button type="button" className="flex-1 py-1.5 text-center text-[10px] font-semibold text-mute hover:bg-brand-50 sm:py-2 sm:text-[11px]" onClick={() => go("facebook")}>
        Facebook
      </button>
    </div>
  );
}
