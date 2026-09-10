"use client";

import { CATEGORY_GROUPS, localizedName } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";
import { useI18n } from "@/lib/i18n/provider";

export function CategorySelect({
  value,
  onChange,
  allowOpen,
  allowEmpty,
  emptyLabel,
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
  const { locale, t } = useI18n();
  return (
    <select
      id={id}
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value as CategoryId | "abierto" | "")}
    >
      {allowEmpty ? <option value="">{emptyLabel ?? t.explore.all}</option> : null}
      {allowOpen ? <option value="abierto">{t.offer.openTo}</option> : null}
      {CATEGORY_GROUPS.map((g) => (
        <optgroup key={g.id} label={`${g.emoji} ${localizedName(g, locale)}`}>
          {g.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {localizedName(c, locale)}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
