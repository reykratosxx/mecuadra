"use client";

import { FilterBar } from "@/components/FilterBar";
import { OfferCard } from "@/components/OfferCard";
import {
  CATEGORY_GROUPS,
  categoriesInGroup,
  categoryLabel,
  type CategoryGroupId,
} from "@/lib/categories";
import { useStore } from "@/lib/store";
import { Empty } from "@/components/ui";

export default function ExplorarPage() {
  const { offers, items, users, filters, setFilters } = useStore();
  const q = filters.q.trim().toLowerCase();
  const groupCats = filters.categoryGroup
    ? categoriesInGroup(filters.categoryGroup)
    : [];

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
    if (
      filters.category &&
      !offered.some((i) => i.category === filters.category) &&
      !o.wants.some((w) => w.category === filters.category)
    ) {
      return false;
    }
    if (
      filters.categoryGroup &&
      !offered.some((i) => groupCats.includes(i.category)) &&
      !o.wants.some((w) => w.category !== "abierto" && groupCats.includes(w.category))
    ) {
      return false;
    }
    if (filters.condition && !offered.some((i) => i.condition === filters.condition)) return false;
    if (filters.province && o.province !== filters.province) return false;
    if (filters.municipality && o.municipality !== filters.municipality) return false;
    if (filters.transport && o.transport !== filters.transport) return false;
    if (filters.openToProposals && !o.openToProposals) return false;
    return true;
  });

  const activeGroup = filters.categoryGroup
    ? CATEGORY_GROUPS.find((g) => g.id === filters.categoryGroup)
    : null;

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
          onClick={() => setFilters({ categoryGroup: "", category: "" })}
          className={`pill shrink-0 ${!filters.categoryGroup && !filters.category ? "pill-on" : ""}`}
        >
          Todas
        </button>
        {CATEGORY_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() =>
              setFilters({
                categoryGroup: filters.categoryGroup === g.id ? "" : (g.id as CategoryGroupId),
                category: "",
              })
            }
            className={`pill shrink-0 ${filters.categoryGroup === g.id ? "pill-on" : ""}`}
          >
            <span className="mr-1" aria-hidden>
              {g.emoji}
            </span>
            {g.label}
          </button>
        ))}
      </div>

      {activeGroup ? (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
          {activeGroup.categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() =>
                setFilters({
                  category: filters.category === c.id ? "" : c.id,
                  categoryGroup: activeGroup.id,
                })
              }
              className={`pill shrink-0 text-xs ${filters.category === c.id ? "pill-on" : ""}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      ) : null}

      <p className="mt-4 text-sm text-mute">
        {list.length} {list.length === 1 ? "oferta" : "ofertas"}
        {filters.category
          ? ` · ${categoryLabel(filters.category)}`
          : filters.categoryGroup
            ? ` · ${activeGroup?.label}`
            : ""}
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
