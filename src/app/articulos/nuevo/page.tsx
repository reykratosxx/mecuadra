"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, CONDITIONS } from "@/lib/categories";
import { useStore } from "@/lib/store";
import type { CategoryId, Condition } from "@/lib/types";
import { RequireAuth } from "@/components/ui";
import { IconCamera } from "@/components/icons";
import { uploadDataUrl } from "@/lib/upload";

const SAMPLES = [
  "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=70",
];

export default function NuevoArticuloPage() {
  return (
    <RequireAuth>
      <Form />
    </RequireAuth>
  );
}

function Form() {
  const router = useRouter();
  const { createItem } = useStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoryId>("alimentos");
  const [condition, setCondition] = useState<Condition>("sellado");
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl">Nuevo artículo</h1>
      <p className="text-sm text-mute">Varias fotos. Luego las recorres sin cerrar la galería.</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const uploaded = await Promise.all(
            photos.map((p) => (p.startsWith("http") ? p : uploadDataUrl("items", p))),
          );
          await createItem({ title, description, category, condition, photos: uploaded });
          router.push("/articulos");
        }}
      >
        <div>
          <label className="label">Fotos</label>
          <div className="flex flex-wrap gap-2">
            {photos.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p} src={p} alt="" className="h-20 w-20 rounded-2xl object-cover" />
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
          <p className="mt-2 text-xs text-mute">O elige una foto de ejemplo (demo):</p>
          <div className="mt-1 flex gap-2 overflow-x-auto">
            {SAMPLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPhotos((ps) => (ps.includes(s) ? ps : [...ps, s]))}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s} alt="" className="h-14 w-14 rounded-xl object-cover" />
              </button>
            ))}
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
            placeholder="Marca, cantidad, si está sellado. Sin precios."
          />
        </div>
        <div>
          <label className="label">Categoría</label>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value as CategoryId)}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
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
        <button type="submit" className="btn-primary w-full" disabled={!title.trim()}>
          Guardar artículo
        </button>
      </form>
    </div>
  );
}
