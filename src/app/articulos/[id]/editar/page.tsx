"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONDITIONS } from "@/lib/categories";
import { useStore } from "@/lib/store";
import type { CategoryId, Condition, Item } from "@/lib/types";
import { RequireAuth } from "@/components/ui";
import { IconCamera } from "@/components/icons";
import { uploadDataUrl } from "@/lib/upload";
import { CategorySelect } from "@/components/CategorySelect";

export default function EditarArticuloPage({
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
  const { currentUser, items, ready } = useStore();
  const item = items.find((i) => i.id === id);

  if (!ready) return <p className="py-10 text-center text-mute">Cargando…</p>;
  if (!item || item.userId !== currentUser?.id) notFound();

  return <EditForm item={item} />;
}

/** Se monta ya con el artículo cargado, así el formulario nace con sus valores. */
function EditForm({ item }: { item: Item }) {
  const router = useRouter();
  const { updateItem } = useStore();

  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [category, setCategory] = useState<CategoryId>(item.category);
  const [condition, setCondition] = useState<Condition>(item.condition);
  const [photos, setPhotos] = useState<string[]>(item.photos);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl">Editar artículo</h1>
      <p className="text-sm text-mute">
        <Link href="/articulos" className="font-semibold text-brand">
          ← Mis artículos
        </Link>
      </p>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          try {
            const uploaded = await Promise.all(
              photos.map((p) => (p.startsWith("http") || p.startsWith("/") ? p : uploadDataUrl("items", p))),
            );
            await updateItem(item.id, {
              title,
              description,
              category,
              condition,
              photos: uploaded,
              status: item.status === "canjeado" ? "activo" : item.status,
            });
            router.push("/articulos");
          } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo guardar.");
            setBusy(false);
          }
        }}
      >
        <div>
          <label className="label">Fotos</label>
          <div className="flex flex-wrap gap-2">
            {photos.map((p) => (
              <div key={p} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p} alt="" className="h-20 w-20 rounded-2xl object-cover" />
                <button
                  type="button"
                  className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-rose-600 text-xs text-white"
                  aria-label="Quitar foto"
                  onClick={() => setPhotos((ps) => ps.filter((x) => x !== p))}
                >
                  ×
                </button>
              </div>
            ))}
            <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-2xl border border-dashed border-line text-mute">
              <IconCamera className="h-6 w-6" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === "string") {
                      setPhotos((ps) => [...ps, reader.result as string]);
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>
        </div>
        <div>
          <label className="label">Título</label>
          <input className="input" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="label">Descripción</label>
          <textarea
            className="input min-h-24"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Categoría</label>
          <CategorySelect value={category} onChange={(v) => setCategory(v as CategoryId)} />
        </div>
        <div>
          <label className="label">Condición</label>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`pill ${condition === c.id ? "pill-on" : ""}`}
                onClick={() => setCondition(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button type="submit" className="btn-primary w-full" disabled={busy || !title.trim()}>
          {busy ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
