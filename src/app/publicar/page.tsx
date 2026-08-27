"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PROVINCES, TRANSPORT_LABEL, municipalitiesOf } from "@/lib/cuba";
import { useStore } from "@/lib/store";
import type { CategoryId, Transport, Want } from "@/lib/types";
import { Empty, RequireAuth } from "@/components/ui";
import Link from "next/link";
import { CategorySelect } from "@/components/CategorySelect";
import { cn, displayTitle } from "@/lib/utils";

export default function PublicarPage() {
  return (
    <RequireAuth>
      <Form />
    </RequireAuth>
  );
}

type FieldErrors = {
  items?: string;
  wants?: string;
  province?: string;
  municipality?: string;
  transport?: string;
  form?: string;
};

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
  const [municipality, setMunicipality] = useState(
    currentUser?.municipality ?? "Plaza de la Revolución",
  );
  const [neighborhood, setNeighborhood] = useState(currentUser?.neighborhood ?? "");
  const [transport, setTransport] = useState<Transport>(currentUser?.transport ?? "sin");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const itemsRef = useRef<HTMLFieldSetElement>(null);
  const wantsRef = useRef<HTMLFieldSetElement>(null);
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

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!selected.length) {
      next.items = "Elige al menos un artículo tocándolo (queda marcado en morado).";
    }
    if (!wants.length && !openToProposals) {
      next.wants = "Añade qué necesitas o marca “Escucho propuestas”.";
    }
    if (!province.trim()) next.province = "Elige la provincia.";
    if (!municipality.trim()) next.municipality = "Elige el municipio.";
    if (!transport) next.transport = "Elige cómo se mueve el trueque.";
    return next;
  }

  async function onPublish(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) {
      if (next.items) itemsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else if (next.wants) wantsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setPublishing(true);
    try {
      const offer = await createOffer({
        itemIds: selected,
        wants: wants.length ? wants : [{ title: "Escucho propuestas", category: "abierto" }],
        openToProposals,
        message,
        province,
        municipality,
        neighborhood,
        transport,
      });
      router.push(`/oferta/${offer.id}`);
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "No se pudo publicar. Inténtalo de nuevo.",
      });
      setPublishing(false);
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

      <form className="mt-6 space-y-4" onSubmit={(e) => void onPublish(e)}>
        <fieldset
          ref={itemsRef}
          className={cn(
            "rounded-2xl p-1",
            errors.items ? "ring-2 ring-rose-400 ring-offset-2" : "",
          )}
        >
          <legend className="label">#cambio · artículos que ofreces</legend>
          <p className="mb-2 text-xs text-mute">
            Toca un artículo para incluirlo en la oferta (debe quedar morado).{" "}
            <Link href="/articulos" className="font-semibold text-brand">
              Ver mis artículos
            </Link>
          </p>
          {errors.items ? (
            <p className="mb-2 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
              {errors.items}
            </p>
          ) : null}
          <ul className="grid gap-2">
            {mine.map((item) => {
              const on = selected.includes(item.id);
              return (
                <li
                  key={item.id}
                  className={cn(
                    "flex items-center gap-2 rounded-2xl border p-2",
                    on ? "border-brand bg-brand-50" : "border-line bg-surface",
                    errors.items && !on ? "border-rose-300" : "",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelected((s) => (on ? s.filter((x) => x !== item.id) : [...s, item.id]));
                      setErrors((er) => ({ ...er, items: undefined }));
                    }}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.photos[0] || "/logo.png"}
                      alt=""
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <span className="min-w-0">
                      <span className="block break-words text-sm font-medium leading-snug">
                        {displayTitle(item.title)}
                      </span>
                      <span className="text-xs text-mute">
                        {item.condition}
                        {on ? " · en esta oferta" : " · toca para elegir"}
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

        <fieldset
          ref={wantsRef}
          className={cn(errors.wants ? "rounded-2xl ring-2 ring-rose-400 ring-offset-2" : "")}
        >
          <legend className="label">#necesito</legend>
          {errors.wants ? (
            <p className="mb-2 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
              {errors.wants}
            </p>
          ) : null}
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
              setErrors((er) => ({ ...er, wants: undefined }));
            }}
          >
            Añadir necesidad
          </button>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={openToProposals}
              onChange={(e) => {
                setOpenToProposals(e.target.checked);
                setErrors((er) => ({ ...er, wants: undefined }));
              }}
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
              className={cn("input", errors.province ? "border-rose-400 ring-2 ring-rose-200" : "")}
              value={province}
              onChange={(e) => {
                setProvince(e.target.value);
                setMunicipality(municipalitiesOf(e.target.value)[0] ?? "");
                setErrors((er) => ({ ...er, province: undefined, municipality: undefined }));
              }}
            >
              {Object.keys(PROVINCES).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            {errors.province ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">
                {errors.province}
              </p>
            ) : null}
          </div>
          <div>
            <label className="label">Municipio</label>
            <select
              className={cn(
                "input",
                errors.municipality ? "border-rose-400 ring-2 ring-rose-200" : "",
              )}
              value={municipality}
              onChange={(e) => {
                setMunicipality(e.target.value);
                setErrors((er) => ({ ...er, municipality: undefined }));
              }}
            >
              {munis.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            {errors.municipality ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">
                {errors.municipality}
              </p>
            ) : null}
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
            className={cn("input", errors.transport ? "border-rose-400 ring-2 ring-rose-200" : "")}
            value={transport}
            onChange={(e) => {
              setTransport(e.target.value as Transport);
              setErrors((er) => ({ ...er, transport: undefined }));
            }}
          >
            {Object.entries(TRANSPORT_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          {errors.transport ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {errors.transport}
            </p>
          ) : null}
        </div>

        {errors.form ? (
          <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
            {errors.form}
          </p>
        ) : null}

        {!selected.length ? (
          <p className="text-center text-xs text-mute">
            Para publicar, toca al menos un artículo arriba hasta que quede marcado.
          </p>
        ) : null}

        <button type="submit" className="btn-primary w-full" disabled={publishing}>
          {publishing ? "Publicando…" : "Publicar oferta"}
        </button>
      </form>
    </div>
  );
}
