"use client";

import { CATEGORY_GROUPS } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";

/** Select de subcategorías agrupadas (estilo Revolico). */
export function CategorySelect({
  value,
  onChange,
  allowOpen,
  allowEmpty,
  emptyLabel = "Todas las categorías",
  id,
  className = "input",
}: {
  value: CategoryId | "abierto" | "";
  onChange: (value: CategoryId | "abierto" | "") => void;
  allowOpen?: boolean;
  allowEmpty?: boolean;
  emptyLabel?: string;
  id?: string;
  className?: string;
}) {
  return (
    <select
      id={id}
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value as CategoryId | "abierto" | "")}
    >
      {allowEmpty ? <option value="">{emptyLabel}</option> : null}
      {allowOpen ? <option value="abierto">Abierto / escucho propuestas</option> : null}
      {CATEGORY_GROUPS.map((g) => (
        <optgroup key={g.id} label={`${g.emoji} ${g.label}`}>
          {g.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
