"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ApplyModal } from "@/components/ApplyModal";
import { Gallery } from "@/components/Gallery";
import { Avatar, Badge, Stars } from "@/components/ui";
import { categoryLabel } from "@/lib/categories";
import { useStore } from "@/lib/store";
import { formatDateTime, timeAgo, wasEdited, displayTitle, localizeWantTitle } from "@/lib/utils";
import { IconArrows, IconPin, IconShield, IconTruck } from "@/components/icons";
import { ShareOffer } from "@/components/ShareOffer";
import { MeCuadraLabel } from "@/components/MeCuadraMark";
import { useI18n } from "@/lib/i18n/provider";

export default function OfertaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, locale } = useI18n();
  const router = useRouter();
  const { offers, items, users, currentUser, trades, ready, updateOffer } = useStore();
  const offer = offers.find((o) => o.id === id);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!ready) return <div className="py-16 text-center text-mute">{t.offer.loading}</div>;
  if (!offer) notFound();

  const owner = users.find((u) => u.id === offer.userId);
  const offered = items.filter((i) => offer.itemIds.includes(i.id));
  const photos = offered.flatMap((i) => i.photos);
  const mine = currentUser?.id === offer.userId;
  const edited = wasEdited(offer.createdAt, offer.updatedAt);
  const existing = trades.find(
    (t) =>
      t.offerId === offer.id &&
      t.applicantId === currentUser?.id &&
      ["pendiente", "aceptado", "entregado"].includes(t.status),
  );

  async function removeOffer() {
    if (
      !window.confirm(
        t.offer.confirmDelete,
      )
    ) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      await updateOffer(offer!.id, { status: "cancelada" });
      router.push("/explorar");
    } catch (e) {
      setError(e instanceof Error ? e.message : t.offer.deleteFail);
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <Gallery photos={photos} alt={offered[0]?.title ?? t.offer.offers} />
        <div className="mt-5 space-y-4">
          {offered.map((item) => (
            <article key={item.id} className="card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="break-words font-display text-xl">{displayTitle(item.title)}</h2>
                <Badge>{categoryLabel(item.category, locale)}</Badge>
                <Badge tone="mute">{t.conditions[item.condition]}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-mute">{item.description}</p>
            </article>
          ))}
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="card p-5">
          <div className="flex items-center justify-between gap-2">
            <Link href={`/perfil/${owner?.id}`} className="flex min-w-0 items-center gap-3">
              <Avatar src={owner?.avatar} name={owner?.name ?? "?"} size={48} />
              <div className="min-w-0">
                <p className="flex items-center gap-1 font-semibold">
                  {owner?.name}
                  {owner?.verified ? <IconShield className="h-4 w-4 text-brand" /> : null}
                </p>
                <Stars value={owner?.ratingAvg ?? 0} count={owner?.ratingCount} />
              </div>
            </Link>
            <span className="shrink-0 text-xs text-mute">{timeAgo(offer.createdAt, locale)}</span>
          </div>

          <dl className="mt-4 space-y-1 rounded-2xl bg-surface-2 px-3 py-2.5 text-xs text-mute">
            <div className="flex justify-between gap-2">
              <dt>{t.offer.published}</dt>
              <dd className="font-medium text-ink">{formatDateTime(offer.createdAt, locale)}</dd>
            </div>
            {edited ? (
              <div className="flex justify-between gap-2">
                <dt>{t.offer.lastEdit}</dt>
                <dd className="font-medium text-ink">
                  {formatDateTime(offer.updatedAt || offer.createdAt, locale)}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-start gap-2 rounded-2xl bg-surface-2 p-3">
            <div>
              <p className="text-[10px] font-semibold uppercase text-mute">{t.offer.offers}</p>
              <ul className="mt-1 space-y-1 text-sm font-medium">
                {offered.map((i) => (
                  <li key={i.id} className="break-words">
                    {displayTitle(i.title)}
                  </li>
                ))}
              </ul>
            </div>
            <span className="mt-4 grid h-8 w-8 place-items-center rounded-full bg-brand text-white">
              <IconArrows className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase text-mute">{t.offer.needs}</p>
              <ul className="mt-1 space-y-1 text-sm font-medium">
                {offer.wants.map((w) => (
                  <li key={w.title} className="break-words">
                    {localizeWantTitle(w.title, t.offer.openTo)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {offer.message ? (
            <p className="mt-4 text-sm leading-6 text-mute">{offer.message}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2 text-sm text-mute">
            <span className="inline-flex items-center gap-1">
              <IconPin className="h-4 w-4" />
              {offer.neighborhood ? `${offer.neighborhood}, ` : ""}
              {offer.municipality}, {offer.province}
            </span>
            <span className="inline-flex items-center gap-1">
              <IconTruck className="h-4 w-4" />
              {t.transport[offer.transport]}
            </span>
          </div>

          {offer.openToProposals ? (
            <p className="mt-3 text-xs text-brand">{t.offer.listens}</p>
          ) : null}

          {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

          {mine ? (
            <div className="mt-5 space-y-2">
              <p className="rounded-2xl bg-brand-50 p-3 text-sm text-brand">{t.offer.yours}</p>
              {offer.status === "abierta" || offer.status === "pausada" ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={`/oferta/${offer.id}/editar`}
                    className="btn-primary flex-1 text-center"
                  >
                    {t.common.edit}
                  </Link>
                  <button
                    type="button"
                    className="btn-ghost flex-1 text-rose-600"
                    disabled={busy}
                    onClick={() => void removeOffer()}
                  >
                    {busy ? t.common.deleting : t.common.delete}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-mute">{t.offer.status}: {offer.status}</p>
              )}
            </div>
          ) : existing ? (
            <Link href={`/chat/${existing.id}`} className="btn-primary mt-5 w-full">
              {t.offer.openChat}
            </Link>
          ) : offer.status === "abierta" ? (
            <div className="mt-5 flex w-full justify-center">
              <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
                <MeCuadraLabel />
              </button>
            </div>
          ) : (
            <p className="mt-5 text-sm text-mute">{t.offer.notOpen}</p>
          )}
        </div>
        <ShareOffer offer={offer} offeredTitles={offered.map((i) => i.title)} />
      </aside>
      {open ? <ApplyModal offerId={offer.id} onClose={() => setOpen(false)} /> : null}
    </div>
  );
}
