"use client";

import { useI18n } from "@/lib/i18n/provider";
import { IconGlobe } from "./icons";

export function LanguageToggle() {
  const { locale, toggle, t } = useI18n();
  const shown = locale === "en" ? "EN" : "ES";

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-8 items-center gap-1 rounded-full px-2 text-xs font-bold tracking-wide text-mute transition hover:bg-hover hover:text-ink sm:h-9 sm:px-2.5"
      aria-label={t.nav.language}
      title={`${t.nav.language}: ${t.langOther}`}
    >
      <IconGlobe className="h-4 w-4" />
      <span>{shown}</span>
    </button>
  );
}
