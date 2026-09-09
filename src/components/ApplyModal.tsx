"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { IconX } from "./icons";
import { MeCuadraLabel, MeCuadraMark } from "./MeCuadraMark";
import { useT } from "@/lib/i18n/provider";

export function ApplyModal({
  offerId,
  onClose,
}: {
  offerId: string;
  onClose: () => void;
}) {
  const t = useT();
  const router = useRouter();
  const { currentUser, items, applyToOffer, offers } = useStore();
  const offer = offers.find((o) => o.id === offerId);
  const mine = items.filter(
    (i) => i.userId === currentUser?.id && i.status === "activo",
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const wants = useMemo(() => offer?.wants.map((w) => w.title).join(", ") ?? "", [offer]);

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-[80] grid place-items-center bg-brand/20 p-4">
        <div className="card max-w-sm p-6 text-center">
          <p className="font-display text-lg">{t.auth.needAuth}</p>
          <p className="mt-1 text-sm text-mute">{t.auth.needAuthHint}</p>
          <a href={`/login?next=/oferta/${offerId}`} className="btn-primary mt-4">
            {t.auth.needAuthCta}
          </a>
          <button type="button" className="btn-ghost mt-2 w-full" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-brand/25 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:items-center sm:pb-3">
      <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl">
              <MeCuadraMark size={36} />
              MeCuadra
            </h2>
            <p className="text-sm text-mute">
              Propón qué das a cambio{wants ? ` · busca: ${wants}` : ""}.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <p className="label">Tus artículos</p>
        {mine.length === 0 ? (
          <p className="mb-3 rounded-2xl bg-surface-2 p-3 text-sm text-mute">
            Aún no tienes artículos. Puedes describir la propuesta abajo o{" "}
            <a className="text-brand underline" href="/articulos/nuevo">
              publicar uno
            </a>
            .
          </p>
        ) : (
          <ul className="mb-3 grid gap-2">
            {mine.map((item) => {
              const on = selected.includes(item.id);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setSelected((s) =>
                        on ? s.filter((x) => x !== item.id) : [...s, item.id],
                      )
                    }
                    className={`flex w-full items-center gap-3 rounded-2xl border p-2 text-left ${
                      on ? "border-brand bg-brand-50" : "border-line"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.photos[0]} alt="" className="h-12 w-12 rounded-xl object-cover" />
                    <span>
                      <span className="block text-sm font-medium">{item.title}</span>
                      <span className="text-xs text-mute">{item.condition}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <label className="label">Mensaje (puedes ofrecer algo que no está publicado)</label>
        <textarea
          className="input min-h-24 mb-3"
          placeholder="Ej: Te ofrezco aceite sellado y puedo ir a Vedado mañana a las 5."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}

        <div className="flex w-full flex-col items-center">
          <button
            type="button"
            className="btn-primary"
            onClick={async () => {
              const res = await applyToOffer(offerId, selected, note);
              if ("error" in res) {
                setError(res.error);
                return;
              }
              onClose();
              router.push(`/chat/${res.id}`);
            }}
          >
            <MeCuadraLabel />
          </button>
          <p className="mt-2 text-center text-xs text-mute">
            No hay dinero en custodia. El trato se confirma entre las dos partes.
          </p>
        </div>
      </div>
    </div>
  );
}
