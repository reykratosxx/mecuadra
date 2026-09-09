"use client";

import { IconMoon, IconSun } from "./icons";
import { useTheme } from "@/lib/theme";
import { useT } from "@/lib/i18n/provider";

export function ThemeToggle() {
  const { toggle } = useTheme();
  const t = useT();

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid h-8 w-8 place-items-center rounded-full text-mute transition hover:bg-hover hover:text-ink sm:h-9 sm:w-9"
      aria-label={t.nav.theme}
      title={t.nav.theme}
    >
      <IconMoon className="h-5 w-5 dark:hidden" />
      <IconSun className="hidden h-5 w-5 dark:block" />
    </button>
  );
}
