"use client";

import { useStore } from "@/lib/store";
import { CategorySelect } from "./CategorySelect";
import { IconFilter, IconX } from "./icons";
import { CATEGORY_GROUPS, CONDITIONS, type CategoryGroupId } from "@/lib/categories";
import { useState } from "react";
import { COUNTRIES, citiesOf } from "@/lib/geo";
import { useT } from "@/lib/i18n/provider";

export function FilterBar() {
  const { filters, setFilters, resetFilters } = useStore();
  const t = useT();
  const [open, setOpen] = useState(false);
  const active =
    Boolean(filters.category) ||
    Boolean(filters.categoryGroup) ||
    Boolean(filters.condition) ||
    Boolean(filters.province) ||
    Boolean(filters.transport) ||
    filters.openToProposals;

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="input"
          placeholder={t.explore.search}
          value={filters.q}
          onChange={(e) => setFilters({ q: e.target.value })}
        />
        <button type="button" className="btn-ghost shrink-0" onClick={() => setOpen(true)}>
          <IconFilter className="h-4 w-4" />
          {t.explore.filter}
          {active ? <span className="h-2 w-2 rounded-full bg-brand" /> : null}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-brand/20 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:items-center sm:pb-3">
          <div className="card max-h-[90vh] w-full max-w-md overflow-y-auto p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl">{t.explore.filter}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label={t.explore.close}>
                <IconX className="h-5 w-5" />
              </button>
            </div>

            <label className="label">{t.explore.group}</label>
            <select
              className="input mb-3"
              value={filters.categoryGroup}
              onChange={(e) =>
                setFilters({
                  categoryGroup: e.target.value as CategoryGroupId | "",
                  category: "",
                })
              }
            >
              <option value="">{t.explore.allGroups}</option>
              {CATEGORY_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.emoji} {t.cats[g.id as keyof typeof t.cats] ?? g.label}
                </option>
              ))}
            </select>

            <label className="label">{t.explore.category}</label>
            <div className="mb-3">
              <CategorySelect
                allowEmpty
                value={filters.category}
                onChange={(v) =>
                  setFilters({
                    category: v === "abierto" || v === "" ? "" : v,
                    categoryGroup: "",
                  })
                }
              />
            </div>

            <label className="label">{t.explore.condition}</label>
            <div className="mb-3 flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() =>
                    setFilters({ condition: filters.condition === c.id ? "" : c.id })
                  }
                  className={`pill ${filters.condition === c.id ? "pill-on" : ""}`}
                >
                  {t.conditions[c.id]}
                </button>
              ))}
            </div>

            <label className="label">{t.explore.country}</label>
            <select
              className="input mb-3"
              value={filters.province}
              onChange={(e) => setFilters({ province: e.target.value, municipality: "" })}
            >
              <option value="">{t.explore.allCountries}</option>
              {Object.keys(COUNTRIES).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {filters.province ? (
              <>
                <label className="label">{t.explore.city}</label>
                <select
                  className="input mb-3"
                  value={filters.municipality}
                  onChange={(e) => setFilters({ municipality: e.target.value })}
                >
                  <option value="">{t.explore.allCities}</option>
                  {citiesOf(filters.province).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </>
            ) : null}

            <label className="label">{t.explore.transport}</label>
            <select
              className="input mb-3"
              value={filters.transport}
              onChange={(e) =>
                setFilters({ transport: e.target.value as typeof filters.transport })
              }
            >
              <option value="">{t.explore.any}</option>
              {(["tengo", "sin", "voy"] as const).map((k) => (
                <option key={k} value={k}>
                  {t.transport[k]}
                </option>
              ))}
            </select>

            <label className="mb-4 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.openToProposals}
                onChange={(e) => setFilters({ openToProposals: e.target.checked })}
              />
              {t.explore.openTo}
            </label>

            <div className="flex gap-2">
              <button type="button" className="btn-ghost flex-1" onClick={() => resetFilters()}>
                {t.explore.clear}
              </button>
              <button type="button" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                {t.explore.results}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
