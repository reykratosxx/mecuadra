"use client";

import { CATEGORIES, CONDITIONS } from "@/lib/categories";
import { PROVINCES, TRANSPORT_LABEL, municipalitiesOf } from "@/lib/cuba";
import { useStore } from "@/lib/store";
import { IconFilter, IconX } from "./icons";
import { useState } from "react";

export function FilterBar() {
  const { filters, setFilters, resetFilters } = useStore();
  const [open, setOpen] = useState(false);
  const active =
    Boolean(filters.category) ||
    Boolean(filters.condition) ||
    Boolean(filters.province) ||
    Boolean(filters.transport) ||
    filters.openToProposals;

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="input"
          placeholder="Busca arroz, dipirona, Vedado, Paloma…"
          value={filters.q}
          onChange={(e) => setFilters({ q: e.target.value })}
        />
        <button type="button" className="btn-ghost shrink-0" onClick={() => setOpen(true)}>
          <IconFilter className="h-4 w-4" />
          Filtrar
          {active ? <span className="h-2 w-2 rounded-full bg-brand" /> : null}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-brand/20 p-3 sm:items-center">
          <div className="card w-full max-w-md p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl">Filtrar</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar">
                <IconX className="h-5 w-5" />
              </button>
            </div>

            <label className="label">Categoría</label>
            <select
              className="input mb-3"
              value={filters.category}
              onChange={(e) => setFilters({ category: e.target.value as typeof filters.category })}
            >
              <option value="">Todas las categorías</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            <label className="label">Condición</label>
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
                  {c.label}
                </button>
              ))}
            </div>

            <label className="label">Provincia</label>
            <select
              className="input mb-3"
              value={filters.province}
              onChange={(e) => setFilters({ province: e.target.value, municipality: "" })}
            >
              <option value="">Toda Cuba</option>
              {Object.keys(PROVINCES).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {filters.province ? (
              <>
                <label className="label">Municipio / zona</label>
                <select
                  className="input mb-3"
                  value={filters.municipality}
                  onChange={(e) => setFilters({ municipality: e.target.value })}
                >
                  <option value="">Todos los municipios</option>
                  {municipalitiesOf(filters.province).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </>
            ) : null}

            <label className="label">Transporte</label>
            <select
              className="input mb-3"
              value={filters.transport}
              onChange={(e) => setFilters({ transport: e.target.value as typeof filters.transport })}
            >
              <option value="">Cualquiera</option>
              {Object.entries(TRANSPORT_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>

            <label className="mb-5 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.openToProposals}
                onChange={(e) => setFilters({ openToProposals: e.target.checked })}
              />
              Solo ofertas que escuchan propuestas
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                className="btn-ghost flex-1"
                onClick={() => {
                  resetFilters();
                  setOpen(false);
                }}
              >
                Limpiar
              </button>
              <button type="button" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                Filtrar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
