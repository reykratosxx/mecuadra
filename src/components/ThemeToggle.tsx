"use client";

import { IconMoon, IconSun } from "./icons";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid h-9 w-9 place-items-center rounded-full text-mute transition hover:bg-hover hover:text-ink"
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      <IconMoon className="h-5 w-5 dark:hidden" />
      <IconSun className="hidden h-5 w-5 dark:block" />
    </button>
  );
}
