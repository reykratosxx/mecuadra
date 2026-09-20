"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CONDITIONS } from "@/lib/categories";
import { useStore } from "@/lib/store";
import type { CategoryId, Condition } from "@/lib/types";
import { RequireAuth } from "@/components/ui";
import { IconCamera } from "@/components/icons";
import { uploadDataUrl } from "@/lib/upload";
import { CategorySelect } from "@/components/CategorySelect";
import { useT } from "@/lib/i18n/provider";

const SAMPLES = [
  "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1510915228340-29c29a4aa08c?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=70",
];

export default function NuevoArticuloPage() {
  return (
    <RequireAuth>
      <Form />
    </RequireAuth>
  );
}

function Form() {
  const t = useT();
  const router = useRouter();
  const { createItem } = useStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoryId>("bicicletas");
  const [condition, setCondition] = useState<Condition>("sellado");
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-3xl">{t.items.newTitle}</h1>
      <p className="text-sm text-mute">{t.items.newLead}</p>
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
          <label className="label">{t.items.photos}</label>
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
          <p className="mt-2 text-xs text-mute">{t.items.sample}</p>
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
          <label className="label" htmlFor="item-title">
            {t.items.fieldTitle}
          </label>
          <input
            id="item-title"
            className="input"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="item-description">
            {t.items.description}
          </label>
          <textarea
            id="item-description"
            className="input min-h-24"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.items.descPlaceholder}
          />
        </div>
        <div>
          <label className="label">{t.items.category}</label>
          <CategorySelect value={category} onChange={(v) => setCategory(v as CategoryId)} />
        </div>
        <div>
          <label className="label">{t.items.condition}</label>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`pill ${condition === c.id ? "pill-on" : ""}`}
                onClick={() => setCondition(c.id)}
              >
                {t.conditions[c.id]}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={!title.trim()}>
          {t.items.saveItem}
        </button>
      </form>
    </div>
  );
}
