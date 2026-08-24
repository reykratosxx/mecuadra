"use client";

import { FilterBar } from "@/components/FilterBar";
import { OfferCard } from "@/components/OfferCard";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { useStore } from "@/lib/store";
import { Empty } from "@/components/ui";

export default function ExplorarPage() {
  const { offers, items, users, filters, setFilters } = useStore();
  const q = filters.q.trim().toLowerCase();

  const list = offers.filter((o) => {
    if (o.status !== "abierta" && o.status !== "en_proceso") return false;
    if (o.status === "en_proceso") return false;
    const offered = items.filter((i) => o.itemIds.includes(i.id));
    const owner = users.find((u) => u.id === o.userId);
    const hay = [
      ...offered.map((i) => `${i.title} ${i.description} ${i.category}`),
      ...o.wants.map((w) => w.title),
      o.message,
      o.municipality,
      o.neighborhood,
      o.province,
      owner?.name,
      owner?.username,
    ]
      .join(" ")
      .toLowerCase();
    if (q && !hay.includes(q)) return false;
    if (filters.category && !offered.some((i) => i.category === filters.category) && !o.wants.some((w) => w.category === filters.category))
      return false;
    if (filters.condition && !offered.some((i) => i.condition === filters.condition)) return false;
    if (filters.province && o.province !== filters.province) return false;
    if (filters.municipality && o.municipality !== filters.municipality) return false;
    if (filters.transport && o.transport !== filters.transport) return false;
    if (filters.openToProposals && !o.openToProposals) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl">Ofertas</h1>
        <p className="text-sm text-mute">Mercado P2P de trueque. El municipio es opcional.</p>
      </div>
      <FilterBar />
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setFilters({ category: "" })}
          className={`pill shrink-0 ${!filters.category ? "pill-on" : ""}`}
        >
          Todas
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilters({ category: filters.category === c.id ? "" : c.id })}
            className={`pill shrink-0 ${filters.category === c.id ? "pill-on" : ""}`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-mute">
        {list.length} {list.length === 1 ? "oferta" : "ofertas"}
        {filters.category ? ` · ${categoryLabel(filters.category)}` : ""}
      </p>
      {list.length === 0 ? (
        <div className="mt-4">
          <Empty
            title="Nada con esos filtros"
            hint="Prueba otra categoría o quita el municipio. Ver ofertas lejanas siempre está permitido."
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {list.map((o) => (
            <OfferCard key={o.id} offer={o} />
          ))}
        </div>
      )}
    </div>
  );
}
