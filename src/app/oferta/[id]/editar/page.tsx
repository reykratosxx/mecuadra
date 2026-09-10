"use client";

import { use, useMemo, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { COUNTRIES, citiesOf } from "@/lib/geo";
import { useStore } from "@/lib/store";
import type { CategoryId, Offer, Transport, Want } from "@/lib/types";
import { RequireAuth } from "@/components/ui";
import { CategorySelect } from "@/components/CategorySelect";
import { useT } from "@/lib/i18n/provider";

export default function EditarOfertaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <RequireAuth>
      <Form id={id} />
    </RequireAuth>
  );
}

function Form({ id }: { id: string }) {
  const t = useT();
  const { currentUser, offers, ready } = useStore();
  const offer = offers.find((o) => o.id === id);

  if (!ready) return <p className="py-10 text-center text-mute">{t.common.loading}</p>;
  if (!offer || offer.userId !== currentUser?.id) notFound();
  if (offer.status === "cancelada" || offer.status === "completada") {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <p className="font-display text-xl">Esta oferta ya no se puede editar.</p>
        <Link href={`/oferta/${id}`} className="btn-primary mt-4 inline-flex">
          {t.common.back}
        </Link>
      </div>
    );
  }

  return <EditForm offer={offer} />;
}

/** Se monta ya con la oferta cargada, así el formulario nace con sus valores. */
function EditForm({ offer }: { offer: Offer }) {
  const t = useT();
  const router = useRouter();
  const { currentUser, items, updateOffer } = useStore();
  const id = offer.id;

  const mine = items.filter(
    (i) =>
      i.userId === currentUser?.id &&
      (i.status === "activo" || offer.itemIds.includes(i.id)),
  );

  const [selected, setSelected] = useState<string[]>(offer.itemIds);
  const [wantTitle, setWantTitle] = useState("");
  const [wantCat, setWantCat] = useState<CategoryId | "abierto">("abierto");
  const [wants, setWants] = useState<Want[]>(
    offer.wants.length ? offer.wants : [{ title: t.offer.openTo, category: "abierto" }],
  );
  const [openToProposals, setOpenToProposals] = useState(offer.openToProposals);
  const [message, setMessage] = useState(offer.message);
  const [province, setProvince] = useState(offer.province);
  const [municipality, setMunicipality] = useState(offer.municipality);
  const [neighborhood, setNeighborhood] = useState(offer.neighborhood);
  const [transport, setTransport] = useState<Transport>(offer.transport);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const munis = useMemo(() => citiesOf(province), [province]);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl">{t.common.edit}</h1>
      <p className="mt-1 text-sm text-mute">
        <Link href={`/oferta/${id}`} className="font-semibold text-brand">
          ← Ver oferta
        </Link>
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!selected.length) return;
          setBusy(true);
          setError("");
          try {
            await updateOffer(id, {
              itemIds: selected,
              wants,
              openToProposals,
              message,
              province,
              municipality,
              neighborhood,
              transport,
              status: offer.status === "pausada" ? "abierta" : offer.status,
            });
            router.push(`/oferta/${id}`);
          } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo guardar.");
            setBusy(false);
          }
        }}
      >
        <fieldset>
          <legend className="label">#cambio · artículos</legend>
          <ul className="grid gap-2">
            {mine.map((item) => {
              const on = selected.includes(item.id);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setSelected((s) => (on ? s.filter((x) => x !== item.id) : [...s, item.id]))
                    }
                    className={`flex w-full items-center gap-3 rounded-2xl border p-2 text-left ${
                      on ? "border-brand bg-brand-50" : "border-line"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.photos[0] || "/logo.png"}
                      alt=""
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <span>
                      <span className="block font-medium">{item.title}</span>
                      <span className="text-xs text-mute">{item.status}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <fieldset>
          <legend className="label">#necesito</legend>
          <ul className="mb-2 flex flex-wrap gap-2">
            {wants.map((w) => (
              <li key={w.title} className="pill">
                {w.title}
                <button
                  type="button"
                  className="ml-1 text-mute"
                  onClick={() => setWants((xs) => xs.filter((x) => x.title !== w.title))}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              className="input"
              placeholder="Ej: leche en polvo"
              value={wantTitle}
              onChange={(e) => setWantTitle(e.target.value)}
            />
            <CategorySelect
              className="input max-w-[50%]"
              allowOpen
              value={wantCat}
              onChange={(v) => setWantCat(v === "" ? "abierto" : v)}
            />
          </div>
          <button
            type="button"
            className="btn-ghost mt-2"
            onClick={() => {
              if (!wantTitle.trim()) return;
              setWants((xs) => [...xs, { title: wantTitle.trim(), category: wantCat }]);
              setWantTitle("");
            }}
          >
            {t.publish.addNeed}
          </button>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={openToProposals}
              onChange={(e) => setOpenToProposals(e.target.checked)}
            />
            {t.publish.openToCheck}
          </label>
        </fieldset>

        <div>
          <label className="label">Nota pública</label>
          <textarea
            className="input min-h-24"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Provincia</label>
            <select
              className="input"
              value={province}
              onChange={(e) => {
                setProvince(e.target.value);
                setMunicipality(citiesOf(e.target.value)[0] ?? "");
              }}
            >
              {Object.keys(COUNTRIES).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Municipio</label>
            <select
              className="input"
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
            >
              {munis.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Barrio / zona</label>
          <input
            className="input"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Transporte</label>
          <select
            className="input"
            value={transport}
            onChange={(e) => setTransport(e.target.value as Transport)}
          >
            {(["tengo", "sin", "voy"] as const).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button type="submit" className="btn-primary w-full" disabled={busy || !selected.length}>
          {busy ? t.common.saving : t.common.save}
        </button>
      </form>
    </div>
  );
}
