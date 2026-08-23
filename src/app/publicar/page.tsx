"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { PROVINCES, TRANSPORT_LABEL, municipalitiesOf } from "@/lib/cuba";
import { useStore } from "@/lib/store";
import type { CategoryId, Transport, Want } from "@/lib/types";
import { Empty, RequireAuth } from "@/components/ui";
import Link from "next/link";

export default function PublicarPage() {
  return (
    <RequireAuth>
      <Form />
    </RequireAuth>
  );
}

function Form() {
  const router = useRouter();
  const { currentUser, items, createOffer, updateItem } = useStore();
  const mine = items.filter((i) => i.userId === currentUser?.id && i.status === "activo");
  const [selected, setSelected] = useState<string[]>([]);
  const [wantTitle, setWantTitle] = useState("");
  const [wantCat, setWantCat] = useState<CategoryId | "abierto">("abierto");
  const [wants, setWants] = useState<Want[]>([{ title: "Escucho propuestas", category: "abierto" }]);
  const [openToProposals, setOpenToProposals] = useState(true);
  const [message, setMessage] = useState("");
  const [province, setProvince] = useState(currentUser?.province ?? "La Habana");
  const [municipality, setMunicipality] = useState(currentUser?.municipality ?? "Plaza de la Revolución");
  const [neighborhood, setNeighborhood] = useState(currentUser?.neighborhood ?? "");
  const [transport, setTransport] = useState<Transport>(currentUser?.transport ?? "sin");
  const [busyId, setBusyId] = useState<string | null>(null);
  const munis = useMemo(() => municipalitiesOf(province), [province]);

  async function removeItem(id: string) {
    if (!window.confirm("¿Eliminar este artículo? No aparecerá más en tus ofertas.")) return;
    setBusyId(id);
    try {
      await updateItem(id, { status: "canjeado" });
      setSelected((s) => s.filter((x) => x !== id));
    } finally {
      setBusyId(null);
    }
  }

  if (mine.length === 0) {
    return (
      <Empty
        title="Primero publica un artículo"
        hint="El trueque parte de algo concreto que ofreces. Luego dices qué necesitas."
        action={
          <Link href="/articulos/nuevo" className="btn-primary">
            Añadir artículo
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl">Publicar oferta</h1>
      <p className="mt-1 text-sm text-mute">
        Formato de Telegram, con fotos: lo que cambias, lo que necesitas, municipio y transporte.
        No se admite pedir efectivo.
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!selected.length) return;
          const offer = await createOffer({
            itemIds: selected,
            wants,
            openToProposals,
            message,
            province,
            municipality,
            neighborhood,
            transport,
          });
          router.push(`/oferta/${offer.id}`);
        }}
      >
        <fieldset>
          <legend className="label">#cambio · artículos que ofreces</legend>
          <p className="mb-2 text-xs text-mute">
            Toca para elegirlos en la oferta. La × los elimina si los creaste por error.{" "}
            <Link href="/articulos" className="font-semibold text-brand">
              Ver mis artículos
            </Link>
          </p>
          <ul className="grid gap-2">
            {mine.map((item) => {
              const on = selected.includes(item.id);
              return (
                <li
                  key={item.id}
                  className={`flex items-center gap-2 rounded-2xl border p-2 ${
                    on ? "border-brand bg-brand-50" : "border-line bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSelected((s) => (on ? s.filter((x) => x !== item.id) : [...s, item.id]))
                    }
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.photos[0]} alt="" className="h-14 w-14 rounded-xl object-cover" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{item.title}</span>
                      <span className="text-xs text-mute">
                        {item.condition}
                        {on ? " · en esta oferta" : ""}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-lg text-rose-600 hover:bg-rose-50"
                    aria-label={`Eliminar ${item.title}`}
                    disabled={busyId === item.id}
                    onClick={() => void removeItem(item.id)}
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
          <Link href="/articulos/nuevo" className="btn-ghost mt-2 w-full">
            + Otro artículo
          </Link>
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
            <select
              className="input max-w-[40%]"
              value={wantCat}
              onChange={(e) => setWantCat(e.target.value as typeof wantCat)}
            >
              <option value="abierto">Abierto</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
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
            Añadir necesidad
          </button>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={openToProposals}
              onChange={(e) => setOpenToProposals(e.target.checked)}
            />
            Escucho propuestas (recomendado)
          </label>
        </fieldset>

        <div>
          <label className="label">Nota pública</label>
          <textarea
            className="input min-h-24"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Sin precios ni CUP. Ej: sin transporte, debe venir a casa."
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
                setMunicipality(municipalitiesOf(e.target.value)[0] ?? "");
              }}
            >
              {Object.keys(PROVINCES).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Municipio</label>
            <select className="input" value={municipality} onChange={(e) => setMunicipality(e.target.value)}>
              {munis.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Barrio / zona (no comuna)</label>
          <input
            className="input"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            placeholder="Vedado, La Víbora, Casino Deportivo…"
          />
        </div>
        <div>
          <label className="label">Transporte</label>
          <select
            className="input"
            value={transport}
            onChange={(e) => setTransport(e.target.value as Transport)}
          >
            {Object.entries(TRANSPORT_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={!selected.length}>
          Publicar oferta
        </button>
      </form>
    </div>
  );
}
